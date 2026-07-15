import { Injectable, NotFoundException } from '@nestjs/common';
import { AmbulanceRepository } from './repository/ambulance.repository';
import { Ambulance } from '../entities/ambulance.entity';
import { CreateAmbulanceDto } from '../dto/create-ambulance.dto';
import { UpdateAmbulanceDto } from '../dto/update-ambulance.dto';
import { QueryAmbulanceDto } from '../dto/query-ambulance.dto';

@Injectable()
export class AmbulanceService {
  constructor(private readonly ambulanceRepository: AmbulanceRepository) {}

  async createAmbulance(dto: CreateAmbulanceDto): Promise<Ambulance> {
    return this.ambulanceRepository.createAmbulance({
      licensePlate: dto.licensePlate,
      type: dto.type,
      hospitalId: dto.hospitalId,
      status: dto.status ?? 'available',
      lastLatitude: dto.lastLatitude,
      lastLongitude: dto.lastLongitude,
      lastLocationUpdate: new Date(),
      isActive: dto.isActive ?? true,
    });
  }

  async getAmbulances(queryDto: QueryAmbulanceDto): Promise<[Ambulance[], number]> {
    return this.ambulanceRepository.findAndPaginate(queryDto);
  }

  async getAmbulanceById(id: string): Promise<Ambulance> {
    const ambulance = await this.ambulanceRepository.findById(id);
    if (!ambulance) {
      throw new NotFoundException(`Ambulance with ID ${id} not found`);
    }
    return ambulance;
  }

  async updateAmbulance(id: string, dto: UpdateAmbulanceDto): Promise<Ambulance> {
    const exists = await this.ambulanceRepository.findById(id);
    if (!exists) {
      throw new NotFoundException(`Ambulance with ID ${id} not found`);
    }
    return this.ambulanceRepository.updateAmbulance(id, {
      licensePlate: dto.licensePlate,
      type: dto.type,
      hospitalId: dto.hospitalId,
      status: dto.status,
      lastLatitude: dto.lastLatitude,
      lastLongitude: dto.lastLongitude,
      // we don't update lastLocationUpdate automatically here; could be set by another service
      isActive: dto.isActive,
    });
  }

  async deleteAmbulance(id: string): Promise<void> {
    const exists = await this.ambulanceRepository.findById(id);
    if (!exists) {
      throw new NotFoundException(`Ambulance with ID ${id} not found`);
    }
    await this.ambulanceRepository.softDelete(id);
  }

  async getAmbulancesByHospitalId(hospitalId: string): Promise<Ambulance[]> {
    return this.ambulanceRepository.findByHospitalId(hospitalId);
  }

  async getNearbyAmbulances(
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): Promise<Ambulance[]> {
    return this.ambulanceRepository.findNearby(latitude, longitude, radiusKm);
  }
}