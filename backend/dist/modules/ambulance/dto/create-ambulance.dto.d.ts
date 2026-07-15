import { AmbulanceType, AmbulanceStatus } from '../entities/ambulance.entity';
export declare class CreateAmbulanceDto {
    licensePlate: string;
    type: AmbulanceType;
    hospitalId: string;
    status?: AmbulanceStatus;
    lastLatitude?: number;
    lastLongitude?: number;
    isActive?: boolean;
}
