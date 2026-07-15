import { Repository } from 'typeorm';
import { Hospital } from '../entities/hospital.entity';
import { QueryHospitalDto } from '../dto/query-hospital.dto';
export declare class HospitalsRepository {
    private readonly repository;
    constructor(repository: Repository<Hospital>);
    findById(id: string): Promise<Hospital | null>;
    findAndPaginate(queryDto: QueryHospitalDto): Promise<[Hospital[], number]>;
    createHospital(data: Partial<Hospital>): Promise<Hospital>;
    updateHospital(id: string, data: Partial<Hospital>): Promise<Hospital>;
    softDelete(id: string): Promise<void>;
    findNearby(latitude: number, longitude: number, radiusKm: number): Promise<Hospital[]>;
}
