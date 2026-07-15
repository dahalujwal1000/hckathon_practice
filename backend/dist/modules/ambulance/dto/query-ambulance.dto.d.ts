import { AmbulanceType, AmbulanceStatus } from '../entities/ambulance.entity';
export declare class QueryAmbulanceDto {
    type?: AmbulanceType;
    status?: AmbulanceStatus;
    hospitalId?: string;
    page?: number;
    limit?: number;
}
