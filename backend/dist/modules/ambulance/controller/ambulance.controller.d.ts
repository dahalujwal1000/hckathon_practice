import { AmbulanceService } from '../service/ambulance.service';
import { CreateAmbulanceDto } from '../dto/create-ambulance.dto';
import { UpdateAmbulanceDto } from '../dto/update-ambulance.dto';
import { QueryAmbulanceDto } from '../dto/query-ambulance.dto';
export declare class AmbulanceController {
    private readonly ambulanceService;
    constructor(ambulanceService: AmbulanceService);
    getAmbulances(queryDto: QueryAmbulanceDto): Promise<{
        data: import("../entities/ambulance.entity").Ambulance[];
        meta: {
            page: number | undefined;
            limit: number | undefined;
            total: number;
        };
    }>;
    getAmbulanceById(id: string): Promise<import("../entities/ambulance.entity").Ambulance>;
    getNearby(latitude: number, longitude: number, distance?: number): Promise<import("../entities/ambulance.entity").Ambulance[]>;
    getByHospital(hospitalId: string): Promise<import("../entities/ambulance.entity").Ambulance[]>;
    createAmbulance(createDto: CreateAmbulanceDto): Promise<import("../entities/ambulance.entity").Ambulance>;
    updateAmbulance(id: string, updateDto: UpdateAmbulanceDto): Promise<import("../entities/ambulance.entity").Ambulance>;
    deleteAmbulance(id: string): Promise<{
        message: string;
    }>;
}
