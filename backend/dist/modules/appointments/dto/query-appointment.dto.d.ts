import { AppointmentStatus } from '../entities/appointment.entity';
export declare class QueryAppointmentDto {
    status?: AppointmentStatus;
    doctorId?: string;
    patientId?: string;
    hospitalId?: string;
    appointmentDateFrom?: Date;
    appointmentDateTo?: Date;
    page?: number;
    limit?: number;
}
