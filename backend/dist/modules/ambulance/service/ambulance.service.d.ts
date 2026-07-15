import { AmbulanceRepository } from './repository/ambulance.repository';
import { Ambulance } from '../entities/ambulance.entity';
import { CreateAmbulanceDto } from '../dto/create-ambulance.dto';
import { UpdateAmbulanceDto } from '../dto/update-ambulance.dto';
import { QueryAmbulanceDto } from '../dto/query-ambulance.dto';
export declare class AmbulanceService {
    private readonly ambulanceRepository;
    constructor(ambulanceRepository: AmbulanceRepository);
    createAmbulance(dto: CreateAmbulanceDto): Promise<Ambulance>;
    getAmbulances(queryDto: QueryAmbulanceDto): Promise<[Ambulance[], number]>;
    getAmbulanceById(id: string): Promise<Ambulance>;
    updateAmbulance(id: string, dto: UpdateAmbulanceDto): Promise<Ambulance>;
    deleteAmbulance(id: string): Promise<void>;
    getAmbulancesByHospitalId(hospitalId: string): Promise<Ambulance[]>;
    getNearbyAmbulances(latitude: number, longitude: number, radiusKm: number): Promise<Ambulance[]>;
}
