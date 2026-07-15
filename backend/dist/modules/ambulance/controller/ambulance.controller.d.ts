import { AmbulanceService } from './service/ambulance.service';
import { CreateAmbulanceDto } from './dto/create-ambulance.dto';
import { UpdateAmbulanceDto } from './dto/update-ambulance.dto';
import { QueryAmbulanceDto } from './dto/query-ambulance.dto';
export declare class AmbulanceController {
    private readonly ambulanceService;
    constructor(ambulanceService: AmbulanceService);
    getAmbulances(queryDto: QueryAmbulanceDto): Promise<{
        data: any;
        meta: {
            page: any;
            limit: any;
            total: any;
        };
    }>;
    getAmbulanceById(id: string): Promise<any>;
    getNearby(latitude: number, longitude: number, distance?: number): Promise<any>;
    getByHospital(hospitalId: string): Promise<any>;
    createAmbulance(createDto: CreateAmbulanceDto): Promise<any>;
    updateAmbulance(id: string, updateDto: UpdateAmbulanceDto): Promise<any>;
    deleteAmbulance(id: string): Promise<{
        message: string;
    }>;
}
