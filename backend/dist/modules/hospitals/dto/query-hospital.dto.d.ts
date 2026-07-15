import { HospitalType } from '../entities/hospital.entity';
export declare class QueryHospitalDto {
    name?: string;
    type?: HospitalType;
    minRating?: number;
    maxRating?: number;
    page?: number;
    limit?: number;
}
