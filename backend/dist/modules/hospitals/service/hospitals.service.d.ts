import { HospitalsRepository } from './repository/hospitals.repository';
import { Hospital } from '../entities/hospital.entity';
import { CreateHospitalDto } from '../dto/create-hospital.dto';
import { UpdateHospitalDto } from '../dto/update-hospital.dto';
import { QueryHospitalDto } from '../dto/query-hospital.dto';
export declare class HospitalsService {
    private readonly hospitalsRepository;
    constructor(hospitalsRepository: HospitalsRepository);
    createHospital(dto: CreateHospitalDto): Promise<Hospital>;
    getHospitals(queryDto: QueryHospitalDto): Promise<[Hospital[], number]>;
    getHospitalById(id: string): Promise<Hospital>;
    updateHospital(id: string, dto: UpdateHospitalDto): Promise<Hospital>;
    deleteHospital(id: string): Promise<void>;
    getNearbyHospitals(latitude: number, longitude: number, radiusKm: number): Promise<Hospital[]>;
}
