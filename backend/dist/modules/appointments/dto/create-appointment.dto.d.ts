import { AppointmentStatus } from '../entities/appointment.entity';
export declare class CreateAppointmentDto {
    patientId: string;
    doctorId: string;
    hospitalId: string;
    appointmentDateTime: Date;
    status?: AppointmentStatus;
    notes?: string;
}
