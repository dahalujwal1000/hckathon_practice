import { DoctorsService } from '../service/doctors.service';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';
import { QueryDoctorDto } from '../dto/query-doctor.dto';
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
    getDoctors(queryDto: QueryDoctorDto): Promise<{
        data: import("../entities/doctor.entity").Doctor[];
        meta: {
            page: number | undefined;
            limit: number | undefined;
            total: number;
        };
    }>;
    getDoctorById(id: string): Promise<import("../entities/doctor.entity").Doctor>;
    createDoctor(createDto: CreateDoctorDto): Promise<import("../entities/doctor.entity").Doctor>;
    updateDoctor(id: string, updateDto: UpdateDoctorDto): Promise<import("../entities/doctor.entity").Doctor>;
    deleteDoctor(id: string): Promise<{
        message: string;
    }>;
}
