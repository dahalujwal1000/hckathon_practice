import { DoctorsRepository } from './repository/doctors.repository';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';
import { Doctor } from '../entities/doctor.entity';
import { QueryDoctorDto } from '../dto/query-doctor.dto';
export declare class DoctorsService {
    private readonly doctorsRepository;
    constructor(doctorsRepository: DoctorsRepository);
    createDoctor(dto: CreateDoctorDto): Promise<Doctor>;
    getDoctors(queryDto: QueryDoctorDto): Promise<[Doctor[], number]>;
    getDoctorById(id: string): Promise<Doctor>;
    updateDoctor(id: string, dto: UpdateDoctorDto): Promise<Doctor>;
    deleteDoctor(id: string): Promise<void>;
}
