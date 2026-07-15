import { HospitalType } from '../entities/hospital.entity';
export declare class UpdateHospitalDto {
    name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    phone?: string;
    website?: string;
    type?: HospitalType;
    rating?: number;
    establishedYear?: number;
    isActive?: boolean;
}
