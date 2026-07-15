import { HospitalsService } from './service/hospitals.service';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { QueryHospitalDto } from './dto/query-hospital.dto';
export declare class HospitalsController {
    private readonly hospitalsService;
    constructor(hospitalsService: HospitalsService);
    getHospitals(queryDto: QueryHospitalDto): Promise<{
        data: any;
        meta: {
            page: any;
            limit: any;
            total: any;
        };
    }>;
    getHospitalById(id: string): Promise<any>;
    getNearby(latitude: number, longitude: number, distance?: number): Promise<any>;
    createHospital(createDto: CreateHospitalDto): Promise<any>;
    updateHospital(id: string, updateDto: UpdateHospitalDto): Promise<any>;
    deleteHospital(id: string): Promise<{
        message: string;
    }>;
}
