import { Injectable, NotFoundException } from '@nestjs/common';
import { HospitalsRepository } from './repository/hospitals.repository';
import { Hospital } from '../entities/hospital.entity';
import { CreateHospitalDto } from '../dto/create-hospital.dto';
import { UpdateHospitalDto } from '../dto/update-hospital.dto';
import { QueryHospitalDto } from '../dto/query-hospital.dto';

@Injectable()
export class HospitalsService {
  constructor(private readonly hospitalsRepository: HospitalsRepository) {}

  async createHospital(dto: CreateHospitalDto): Promise<Hospital> {
    return this.hospitalsRepository.createHospital({
      name: dto.name,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      phone: dto.phone,
      website: dto.website,
      type: dto.type,
      rating: dto.rating,
      establishedYear: dto.establishedYear,
      isActive: dto.isActive ?? true,
    });
  }

  async getHospitals(queryDto: QueryHospitalDto): Promise<[Hospital[], number]> {
    return this.hospitalsRepository.findAndPaginate(queryDto);
  }

  async getHospitalById(id: string): Promise<Hospital> {
    const hospital = await this.hospitalsRepository.findById(id);
    if (!hospital) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }
    return hospital;
  }

  async updateHospital(id: string, dto: UpdateHospitalDto): Promise<Hospital> {
    const exists = await this.hospitalsRepository.findById(id);
    if (!exists) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }
    return this.hospitalsRepository.updateHospital(id, {
      name: dto.name,
      address: dto.address,
      latitude: dto.latitude,
      longitude: dto.longitude,
      phone: dto.phone,
      website: dto.website,
      type: dto.type,
      rating: dto.rating,
      establishedYear: dto.establishedYear,
      isActive: dto.isActive,
    });
  }

  async deleteHospital(id: string): Promise<void> {
    const exists = await this.hospitalsRepository.findById(id);
    if (!exists) {
      throw new NotFoundException(`Hospital with ID ${id} not found`);
    }
    await this.hospitalsRepository.softDelete(id);
  }

  async getNearbyHospitals(
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): Promise<Hospital[]> {
    return this.hospitalsRepository.findNearby(latitude, longitude, radiusKm);
  }
}