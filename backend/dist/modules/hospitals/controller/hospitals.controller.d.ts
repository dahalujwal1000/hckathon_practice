import { HospitalsService } from '../service/hospitals.service';
import { CreateHospitalDto } from '../dto/create-hospital.dto';
import { UpdateHospitalDto } from '../dto/update-hospital.dto';
import { QueryHospitalDto } from '../dto/query-hospital.dto';
export declare class HospitalsController {
    private readonly hospitalsService;
    constructor(hospitalsService: HospitalsService);
    getHospitals(queryDto: QueryHospitalDto): Promise<{
        data: import("../entities/hospital.entity").Hospital[];
        meta: {
            page: number | undefined;
            limit: number | undefined;
            total: number;
        };
    }>;
    getHospitalById(id: string): Promise<import("../entities/hospital.entity").Hospital>;
    getNearby(latitude: number, longitude: number, distance?: number): Promise<import("../entities/hospital.entity").Hospital[]>;
    createHospital(createDto: CreateHospitalDto): Promise<import("../entities/hospital.entity").Hospital>;
    updateHospital(id: string, updateDto: UpdateHospitalDto): Promise<import("../entities/hospital.entity").Hospital>;
    deleteHospital(id: string): Promise<{
        message: string;
    }>;
}
