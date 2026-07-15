import { Repository } from 'typeorm';
import { Ambulance } from '../entities/ambulance.entity';
import { QueryAmbulanceDto } from '../dto/query-ambulance.dto';
export declare class AmbulanceRepository {
    private readonly repository;
    constructor(repository: Repository<Ambulance>);
    findById(id: string): Promise<Ambulance | null>;
    findAndPaginate(queryDto: QueryAmbulanceDto): Promise<[Ambulance[], number]>;
    createAmbulance(data: Partial<Ambulance>): Promise<Ambulance>;
    updateAmbulance(id: string, data: Partial<Ambulance>): Promise<Ambulance>;
    softDelete(id: string): Promise<void>;
    findByHospitalId(hospitalId: string): Promise<Ambulance[]>;
    findNearby(latitude: number, longitude: number, radiusKm: number): Promise<Ambulance[]>;
}
