import { Repository } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';
import { QueryDoctorDto } from '../dto/query-doctor.dto';
export declare class DoctorsRepository {
    private readonly repository;
    constructor(repository: Repository<Doctor>);
    findById(id: string): Promise<Doctor | null>;
    findAndPaginate(queryDto: QueryDoctorDto): Promise<[Doctor[], number]>;
    createDoctor(data: Partial<Doctor>): Promise<Doctor>;
    updateDoctor(id: string, data: Partial<Doctor>): Promise<Doctor>;
    softDelete(id: string): Promise<void>;
}
