import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { QueryAppointmentDto } from '../dto/query-appointment.dto';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../users/entities/user.entity';

@Injectable()
export class AppointmentsRepository {
  constructor(
    @InjectRepository(Appointment)
    private readonly repository: Repository<Appointment>,
  ) {}

  async findById(id: string): Promise<Appointment | null> {
    return this.repository.findOne({ where: { id }, relations: ['patient', 'doctor', 'hospital'] });
  }

  async findAndPaginate(
    queryDto: QueryAppointmentDto,
    currentUser: User,
  ): Promise<[Appointment[], number]> {
    const { page = 1, limit = 10, status, doctorId, patientId, hospitalId, appointmentDateFrom, appointmentDateTo } = queryDto;

    const qb = this.repository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.hospital', 'hospital');

    // Apply filters based on user role
    if (currentUser.role === UserRole.PATIENT) {
      // Patients can only see their own appointments
      qb.andWhere('appointment.patientId = :patientId', { patientId: currentUser.id });
    } else if (currentUser.role === UserRole.DOCTOR) {
      // Doctors can see appointments where they are the doctor
      qb.leftJoin('doctor.user', 'doctorUser')
        .andWhere('doctorUser.id = :userId', { userId: currentUser.id });
    }
    // For admin, no additional restriction

    // Apply additional filters
    if (status) {
      qb.andWhere('appointment.status = :status', { status });
    }
    if (doctorId) {
      qb.andWhere('appointment.doctorId = :doctorId', { doctorId });
    }
    if (patientId) {
      qb.andWhere('appointment.patientId = :patientId', { patientId });
    }
    if (hospitalId) {
      qb.andWhere('appointment.hospitalId = :hospitalId', { hospitalId });
    }
    if (appointmentDateFrom) {
      qb.andWhere('appointment.appointmentDateTime >= :appointmentDateFrom', { appointmentDateFrom });
    }
    if (appointmentDateTo) {
      qb.andWhere('appointment.appointmentDateTime <= :appointmentDateTo', { appointmentDateTo });
    }

    // Apply pagination
    const [data, total] = await qb
      .orderBy('appointment.appointmentDateTime', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return [data, total];
  }

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    const appointment = this.repository.create(data);
    return this.repository.save(appointment);
  }

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    await this.repository.update(id, data);
    const updated = await this.repository.findOne({ where: { id }, relations: ['patient', 'doctor', 'hospital'] });
    if (!updated) {
      throw new Error('Appointment not found after update');
    }
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete({ id });
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    return this.repository.find({
      where: { patientId },
      relations: ['doctor', 'hospital'],
      order: { appointmentDateTime: 'ASC' },
    });
  }

  async findByDoctorId(doctorId: string): Promise<Appointment[]> {
    return this.repository.find({
      where: { doctorId },
      relations: ['patient', 'hospital'],
      order: { appointmentDateTime: 'ASC' },
    });
  }

  async findByHospitalId(hospitalId: string, currentUser: User): Promise<Appointment[]> {
    const qb = this.repository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .where('appointment.hospitalId = :hospitalId', { hospitalId });

    // Apply role-based filtering
    if (currentUser.role === UserRole.PATIENT) {
      qb.andWhere('appointment.patientId = :patientId', { patientId: currentUser.id });
    } else if (currentUser.role === UserRole.DOCTOR) {
      // Join the doctor's user to filter by the user id
      qb.leftJoin('doctor.user', 'doctorUser')
        .andWhere('doctorUser.id = :userId', { userId: currentUser.id });
    }
    // For admin, no additional restriction

    return qb.getMany();
  }
}