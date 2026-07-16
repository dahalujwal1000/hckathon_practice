import { User } from '../../users/entities/user.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Hospital } from '../../hospitals/entities/hospital.entity';
export declare enum AppointmentStatus {
    SCHEDULED = "scheduled",
    COMPLETED = "completed",
    CANCELLED = "cancelled",
    NO_SHOW = "no_show"
}
export declare class Appointment {
    id: string;
    patient: User;
    patientId: string;
    doctor: Doctor;
    doctorId: string;
    hospital: Hospital;
    hospitalId: string;
    appointmentDateTime: Date;
    status: AppointmentStatus;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
