import { AppointmentsService } from '../service/appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { QueryAppointmentDto } from '../dto/query-appointment.dto';
import { User } from '../../users/entities/user.entity';
export declare class AppointmentsController {
    private readonly appointmentsService;
    constructor(appointmentsService: AppointmentsService);
    getAppointments(queryDto: QueryAppointmentDto, currentUser: User): Promise<[Appointment[], number]>;
    getAppointmentById(id: string, currentUser: User): Promise<Appointment>;
    createAppointment(createDto: CreateAppointmentDto, currentUser: User): Promise<Appointment>;
    updateAppointment(id: string, updateDto: UpdateAppointmentDto, currentUser: User): Promise<Appointment>;
    cancelAppointment(id: string, currentUser: User): Promise<void>;
    getAppointmentsByPatient(patientId: string, currentUser: User): Promise<Appointment[]>;
    getAppointmentsByDoctor(doctorId: string, currentUser: User): Promise<Appointment[]>;
    getAppointmentsByHospital(hospitalId: string, currentUser: User): Promise<Appointment[]>;
}
