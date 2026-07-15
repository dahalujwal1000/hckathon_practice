import { DoctorsService } from './service/doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { QueryDoctorDto } from './dto/query-doctor.dto';
export declare class DoctorsController {
    private readonly doctorsService;
    constructor(doctorsService: DoctorsService);
    getDoctors(queryDto: QueryDoctorDto): Promise<{
        data: any;
        meta: {
            page: any;
            limit: any;
            total: any;
        };
    }>;
    getDoctorById(id: string): Promise<any>;
    createDoctor(createDto: CreateDoctorDto): Promise<any>;
    updateDoctor(id: string, updateDto: UpdateDoctorDto): Promise<any>;
    deleteDoctor(id: string): Promise<{
        message: string;
    }>;
}
