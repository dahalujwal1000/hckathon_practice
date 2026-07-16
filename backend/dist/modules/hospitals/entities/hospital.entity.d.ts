import { Appointment } from '../../appointments/entities/appointment.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';
export declare enum HospitalType {
    GOVERNMENT = "government",
    PRIVATE = "private",
    NGO = "ngo",
    COMMUNITY = "community"
}
export declare class Hospital {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone?: string;
    website?: string;
    type: HospitalType;
    rating?: number;
    establishedYear?: number;
    isActive: boolean;
    doctors: Doctor[];
    ambulances: Ambulance[];
    appointments: Appointment[];
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
