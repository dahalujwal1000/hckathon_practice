import { HospitalType } from '../entities/hospital.entity';
export declare class CreateHospitalDto {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone?: string;
    website?: string;
    type: HospitalType;
    rating?: number;
    establishedYear?: number;
    isActive?: boolean;
}
