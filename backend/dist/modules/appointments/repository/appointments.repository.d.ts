import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { QueryAppointmentDto } from './dto/query-appointment.dto';
import { User } from '../../users/entities/user.entity';
export declare class AppointmentsRepository {
    private readonly repository;
    constructor(repository: Repository<Appointment>);
    findById(id: string): Promise<Appointment | null>;
    findAndPaginate(queryDto: QueryAppointmentDto, currentUser: User): Promise<[Appointment[], number]>;
    createAppointment(data: Partial<Appointment>): Promise<Appointment>;
    updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment>;
    softDelete(id: string): Promise<void>;
    findByPatientId(patientId: string): Promise<Appointment[]>;
    findByDoctorId(doctorId: string): Promise<Appointment[]>;
    findByHospitalId(hospitalId: string, currentUser: User): Promise<Appointment[]>;
}
