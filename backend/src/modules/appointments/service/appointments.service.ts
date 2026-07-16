import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { AppointmentsRepository } from '../repository/appointments.repository';
import { Appointment } from '../entities/appointment.entity';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { QueryAppointmentDto } from '../dto/query-appointment.dto';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/entities/user.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Hospital } from '../../hospitals/entities/hospital.entity';
import { DoctorsRepository } from '../../doctors/repository/doctors.repository';
import { HospitalsRepository } from '../../hospitals/repository/hospitals.repository';
import { UsersRepository } from '../../users/repository/users.repository';
import { EmailService } from '../../../shared/services/email.service';
import { EntityManager } from 'typeorm';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly doctorsRepository: DoctorsRepository,
    private readonly hospitalsRepository: HospitalsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly emailService: EmailService,
  ) {}

  async getAppointments(
    queryDto: QueryAppointmentDto,
    currentUser: User,
  ): Promise<[Appointment[], number]> {
    return this.appointmentsRepository.findAndPaginate(queryDto, currentUser);
  }

  async getAppointmentById(id: string, currentUser: User): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Check if the current user is authorized to view this appointment
    const isPatient = currentUser.id === appointment.patientId;
    let isDoctor = false;
    if (currentUser.role === UserRole.DOCTOR) {
      const doctor = await this.doctorsRepository.findById(appointment.doctorId);
      isDoctor = doctor && doctor.userId === currentUser.id;
    }
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isPatient && !isDoctor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to view this appointment');
    }

    return appointment;
  }

  async createAppointment(
    createDto: CreateAppointmentDto,
    currentUser: User,
  ): Promise<Appointment> {
    // Validate patient, doctor, hospital
    const patientExists = await this.validatePatient(createDto.patientId);
    if (!patientExists) {
      throw new NotFoundException(`Patient with ID ${createDto.patientId} not found`);
    }

    const doctorExists = await this.validateDoctor(createDto.doctorId);
    if (!doctorExists) {
      throw new NotFoundException(`Doctor with ID ${createDto.doctorId} not found`);
    }

    const hospitalExists = await this.validateHospital(createDto.hospitalId);
    if (!hospitalExists) {
      throw new NotFoundException(`Hospital with ID ${createDto.hospitalId} not found`);
    }

    // Authorization: who can create an appointment?
    // - Patient can create an appointment for themselves
    // - Admin can create an appointment for any patient
    if (currentUser.role === UserRole.PATIENT && currentUser.id !== createDto.patientId) {
      throw new ForbiddenException('Patients can only create appointments for themselves');
    }

    // Use transaction to ensure consistency
    return this.appointmentsRepository.manager.transaction(async (manager) => {
      const appointmentRepo = manager.getRepository(Appointment);
      const userRepo = manager.getRepository(User);
      const doctorRepo = manager.getRepository(Doctor);
      const hospitalRepo = manager.getRepository(Hospital);

      // Create and save appointment
      const appointment = appointmentRepo.create({
        patientId: createDto.patientId,
        doctorId: createDto.doctorId,
        hospitalId: createDto.hospitalId,
        appointmentDateTime: new Date(createDto.appointmentDateTime),
        status: createDto.status || 'scheduled',
        notes: createDto.notes,
      });
      const savedAppointment = await appointmentRepo.save(appointment);

      // Fetch related data for email (within transaction)
      const [patient, doctor, hospital] = await Promise.all([
        userRepo.findOne({ where: { id: createDto.patientId } }),
        doctorRepo.findOne({ where: { id: createDto.doctorId } }),
        hospitalRepo.findOne({ where: { id: createDto.hospitalId } }),
      ]);

      // Send email (non-blocking) - if email fails we log but do not rollback transaction
      if (patient && doctor && hospital) {
        this.emailService
          .sendAppointmentConfirmation(
            patient.email,
            patient.name,
            {
              doctorName: doctor.name,
              hospitalName: hospital.name,
              appointmentDateTime: savedAppointment.appointmentDateTime,
              status: savedAppointment.status,
              notes: savedAppointment.notes,
            },
          )
          .catch((error) => {
            console.error('Failed to send appointment confirmation email:', error);
          });
      }

      return savedAppointment;
    });
  }

  async updateAppointment(
    id: string,
    updateDto: UpdateAppointmentDto,
    currentUser: User,
  ): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Check if the current user is authorized to update this appointment
    const isPatient = currentUser.id === appointment.patientId;
    let isDoctor = false;
    if (currentUser.role === UserRole.DOCTOR) {
      const doctor = await this.doctorsRepository.findById(appointment.doctorId);
      isDoctor = doctor && doctor.userId === currentUser.id;
    }
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isPatient && !isDoctor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to update this appointment');
    }

    // Validate doctor and hospital if they are being updated
    if (updateDto.doctorId) {
      const doctorExists = await this.validateDoctor(updateDto.doctorId);
      if (!doctorExists) {
        throw new NotFoundException(`Doctor with ID ${updateDto.doctorId} not found`);
      }
    }
    if (updateDto.hospitalId) {
      const hospitalExists = await this.validateHospital(updateDto.hospitalId);
      if (!hospitalExists) {
        throw new NotFoundException(`Hospital with ID ${updateDto.hospitalId} not found`);
      }
    }

    // Update the appointment
    const updateData: any = {};
    if (updateDto.patientId !== undefined) {
      // Only allow patientId to be changed by admin
      if (currentUser.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Only administrators can change the patient for an appointment');
      }
      // Validate the new patient
      const patientExists = await this.validatePatient(updateDto.patientId);
      if (!patientExists) {
        throw new NotFoundException(`Patient with ID ${updateDto.patientId} not found`);
      }
      updateData.patientId = updateDto.patientId;
    }
    if (updateDto.doctorId !== undefined) {
      updateData.doctorId = updateDto.doctorId;
    }
    if (updateDto.hospitalId !== undefined) {
      updateData.hospitalId = updateDto.hospitalId;
    }
    if (updateDto.appointmentDateTime !== undefined) {
      updateData.appointmentDateTime = new Date(updateDto.appointmentDateTime);
    }
    if (updateDto.status !== undefined) {
      updateData.status = updateDto.status;
    }
    if (updateDto.notes !== undefined) {
      updateData.notes = updateDto.notes;
    }

    return this.appointmentsRepository.updateAppointment(id, updateData);
  }

  async cancelAppointment(id: string, currentUser: User): Promise<void> {
    const appointment = await this.appointmentsRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    // Check if the current user is authorized to cancel this appointment
    const isPatient = currentUser.id === appointment.patientId;
    let isDoctor = false;
    if (currentUser.role === UserRole.DOCTOR) {
      const doctor = await this.doctorsRepository.findById(appointment.doctorId);
      isDoctor = doctor && doctor.userId === currentUser.id;
    }
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isPatient && !isDoctor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to cancel this appointment');
    }

    await this.appointmentsRepository.softDelete(id);
  }

  async getAppointmentsByPatient(
    patientId: string,
    currentUser: User,
  ): Promise<Appointment[]> {
    // Authorization: patient can view their own, admin can view any, doctor can view appointments where they are the doctor for that patient?
    // Actually, the requirement: doctor can view appointments where they are the doctor.
    // So for the endpoint GET /appointments/patient/:patientId, a doctor should only be able to see
    // the appointments for that patient where they are the doctor.
    const isPatient = currentUser.id === patientId;
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isPatient && !isAdmin && currentUser.role !== UserRole.DOCTOR) {
      throw new ForbiddenException('You do not have permission to view these appointments');
    }

    let appointments = await this.appointmentsRepository.findByPatientId(patientId);

    // If the current user is a doctor, filter to only appointments where they are the doctor
    if (currentUser.role === UserRole.DOCTOR && !isPatient && !isAdmin) {
      appointments = await Promise.all(
        appointments.map(async (appointment) => {
          const doctor = await this.doctorsRepository.findById(appointment.doctorId);
          return doctor && doctor.userId === currentUser.id ? appointment : null;
        }),
      ).then((results) => results.filter((appt): appt is Appointment => appt !== null));
    }

    return appointments;
  }

  async getAppointmentsByDoctor(
    doctorId: string,
    currentUser: User,
  ): Promise<Appointment[]> {
    // Authorization: doctor can view their own appointments, admin can view any
    const isDoctor = await this.isDoctorForDoctorId(doctorId, currentUser);
    const isAdmin = currentUser.role === UserRole.ADMIN;

    if (!isDoctor && !isAdmin) {
      throw new ForbiddenException('You do not have permission to view these appointments');
    }

    return this.appointmentsRepository.findByDoctorId(doctorId);
  }

  async getAppointmentsByHospital(
    hospitalId: string,
    currentUser: User,
  ): Promise<Appointment[]> {
    // Authorization: admin can view any hospital's appointments,
    // doctors can view appointments where they are the doctor in that hospital,
    // patients can view their own appointments in that hospital.
    return this.appointmentsRepository.findByHospitalId(hospitalId, currentUser);
  }

  private async validatePatient(patientId: string): Promise<boolean> {
    const patient = await this.usersRepository.findById(patientId);
    return !!patient && patient.role === UserRole.PATIENT;
  }

  private async validateDoctor(doctorId: string): Promise<boolean> {
    const doctor = await this.doctorsRepository.findById(doctorId);
    return !!doctor;
  }

  private async validateHospital(hospitalId: string): Promise<boolean> {
    const hospital = await this.hospitalsRepository.findById(hospitalId);
    return !!hospital;
  }

  private async isDoctorForDoctorId(doctorId: string, currentUser: User): Promise<boolean> {
    if (currentUser.role !== UserRole.DOCTOR) {
      return false;
    }
    const doctor = await this.doctorsRepository.findById(doctorId);
    return !!doctor && doctor.userId === currentUser.id;
  }
}