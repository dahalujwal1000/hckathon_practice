import { Hospital } from '../../hospitals/entities/hospital.entity';
export declare enum AmbulanceType {
    GROUND = "ground",
    AIR = "air"
}
export declare enum AmbulanceStatus {
    AVAILABLE = "available",
    ON_CALL = "on_call",
    MAINTENANCE = "maintenance"
}
export declare class Ambulance {
    id: string;
    licensePlate: string;
    type: AmbulanceType;
    baseHospital: Hospital;
    status: AmbulanceStatus;
    lastLatitude?: number;
    lastLongitude?: number;
    lastLocationUpdate?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
