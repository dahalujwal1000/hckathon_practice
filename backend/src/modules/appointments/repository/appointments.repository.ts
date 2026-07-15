import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { QueryAppointmentDto } from './dto/query-appointment.dto';
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
    if (currentUser.role === 'patient') {
      // Patients can only see their own appointments
      qb.andWhere('appointment.patientId = :patientId', { patientId: currentUser.id });
    } else if (currentUser.role === 'doctor') {
      // Doctors can see appointments where they are the doctor
      qb.andWhere('appointment.doctorId = :doctorId', { doctorId: currentUser.id }); // Wait, doctorId in appointment is the doctor's id, not the user's id.
      // We need to join the doctor's user to check.
      // Let's adjust: we'll join the doctor's user and then filter by user id.
      // We'll change the query to:
      //   leftJoin appointment.doctor doctor
      //   leftJoin doctor.user doctorUser
      //   where doctorUser.id = :userId
      // But we already have a join for doctor. We'll add another join for the doctor's user.
      // Let's rebuild the query for doctor role.
      // We'll do it in a separate branch for clarity.
    } else if (currentUser.role === 'admin') {
      // Admins can see all appointments, but we can still apply filters
    }

    // We'll rebuild the query with proper joins for role-based filtering.
    // Let's start over and build the query step by step.

    // Reset the query builder
    const qbReset = this.repository.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.hospital', 'hospital');

    // Now apply role-based filters
    if (currentUser.role === 'patient') {
      qbReset.andWhere('appointment.patientId = :patientId', { patientId: currentUser.id });
    } else if (currentUser.role === 'doctor') {
      // For doctors, we need to join the doctor's user to filter by the user id
      qbReset
        .leftJoin('doctor.user', 'doctorUser')
        .andWhere('doctorUser.id = :userId', { userId: currentUser.id });
    }
    // For admin, no additional restriction

    // Apply additional filters
    if (status) {
      qbReset.andWhere('appointment.status = :status', { status });
    }
    if (doctorId) {
      qbReset.andWhere('appointment.doctorId = :doctorId', { doctorId });
    }
    if (patientId) {
      qbReset.andWhere('appointment.patientId = :patientId', { patientId: patientId });
    }
    if (hospitalId) {
      qbReset.andWhere('appointment.hospitalId = :hospitalId', { hospitalId: hospitalId });
    }
    if (appointmentDateFrom) {
      qbReset.andWhere('appointment.appointmentDateTime >= :appointmentDateFrom', { appointmentDateFrom });
    }
    if (appointmentDateTo) {
      qbReset.andWhere('appointment.appointmentDateTime <= :appointmentDateTo', { appointmentDateTo });
    }

    // Apply pagination
    const [data, total] = await qbReset
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
    if (currentUser.role === 'patient') {
      qb.andWhere('appointment.patientId = :patientId', { patientId: currentUser.id });
    } else if (currentUser.role === 'doctor') {
      // Join the doctor's user to filter by the user id
      qb.leftJoin('doctor.user', 'doctorUser')
        .andWhere('doctorUser.id = :userId', { userId: currentUser.id });
    }
    // For admin, no additional restriction

    return qb.getMany();
  }
}