import { AppointmentStatus } from '../entities/appointment.entity';
export declare class UpdateAppointmentDto {
    patientId?: string;
    doctorId?: string;
    hospitalId?: string;
    appointmentDateTime?: Date;
    status?: AppointmentStatus;
    notes?: string;
}
