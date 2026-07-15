import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';
import { QueryDoctorDto } from '../dto/query-doctor.dto';

@Injectable()
export class DoctorsRepository {
  constructor(
    @InjectRepository(Doctor)
    private readonly repository: Repository<Doctor>,
  ) {}

  async findById(id: string): Promise<Doctor | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAndPaginate(queryDto: QueryDoctorDto): Promise<[Doctor[], number]> {
    const { page = 1, limit = 10, specialization, hospitalId, minExperience, maxFee, availableDay } = queryDto;

    const qb = this.repository.createQueryBuilder('doctor');

    if (specialization) {
      qb.andWhere('doctor.specialization = :specialization', { specialization });
    }
    if (hospitalId) {
      qb.andWhere('doctor.hospitalId = :hospitalId', { hospitalId });
    }
    if (minExperience !== undefined) {
      qb.andWhere('doctor.experienceYears >= :minExperience', { minExperience });
    }
    if (maxFee !== undefined) {
      qb.andWhere('doctor.consultationFee <= :maxFee', { maxFee });
    }
    if (availableDay) {
      // PostgreSQL array contains
      qb.andWhere('doctor.availableDays @> ARRAY[:availableDay]::text[]', { availableDay });
    }

    const [data, total] = await qb
      .orderBy('doctor.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return [data, total];
  }

  async createDoctor(data: Partial<Doctor>): Promise<Doctor> {
    const doc = this.repository.create(data);
    return this.repository.save(doc);
  }

  async updateDoctor(id: string, data: Partial<Doctor>): Promise<Doctor> {
    await this.repository.update(id, data);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Doctor not found after update');
    }
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete({ id });
  }
}