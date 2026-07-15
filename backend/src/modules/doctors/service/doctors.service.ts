import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { DoctorsRepository } from './repository/doctors.repository';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';
import { Doctor } from '../entities/doctor.entity';
import { QueryDoctorDto } from '../dto/query-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(private readonly doctorsRepository: DoctorsRepository) {}

  async createDoctor(dto: CreateDoctorDto): Promise<Doctor> {
    // Optionally check if doctor with same specialization and hospital exists? Not required.
    return this.doctorsRepository.createDoctor({
      specialization: dto.specialization,
      hospitalId: dto.hospitalId,
      biography: dto.bio,
      experienceYears: dto.experienceYears,
      consultationFee: dto.consultationFee,
      availableDays: dto.availableDays,
      isActive: true,
    });
  }

  async getDoctors(queryDto: QueryDoctorDto): Promise<[Doctor[], number]> {
    return this.doctorsRepository.findAndPaginate(queryDto);
  }

  async getDoctorById(id: string): Promise<Doctor> {
    const doctor = await this.doctorsRepository.findById(id);
    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return doctor;
  }

  async updateDoctor(id: string, dto: UpdateDoctorDto): Promise<Doctor> {
    const exists = await this.doctorsRepository.findById(id);
    if (!exists) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    return this.doctorsRepository.updateDoctor(id, {
      specialization: dto.specialization,
      hospitalId: dto.hospitalId,
      biography: dto.bio,
      experienceYears: dto.experienceYears,
      consultationFee: dto.consultationFee,
      availableDays: dto.availableDays,
    });
  }

  async deleteDoctor(id: string): Promise<void> {
    const exists = await this.doctorsRepository.findById(id);
    if (!exists) {
      throw new NotFoundException(`Doctor with ID ${id} not found`);
    }
    await this.doctorsRepository.softDelete(id);
  }
}