import { Injectable, NotFoundException } from '@nestjs/common';
import { AmbulanceRepository } from '../repository/ambulance.repository';
import { Ambulance } from '../entities/ambulance.entity';
import { CreateAmbulanceDto } from '../dto/create-ambulance.dto';
import { UpdateAmbulanceDto } from '../dto/update-ambulance.dto';
import { QueryAmbulanceDto } from '../dto/query-ambulance.dto';
import { AmbulanceStatus } from '../entities/ambulance.entity';
import { Hospital } from '../../hospitals/entities/hospital.entity';

@Injectable()
export class AmbulanceService {
  constructor(private readonly ambulanceRepository: AmbulanceRepository) {}

  async createAmbulance(createDto: CreateAmbulanceDto): Promise<Ambulance> {
    return this.ambulanceRepository.createAmbulance({
      licensePlate: createDto.licensePlate,
      type: createDto.type,
      baseHospital: { id: createDto.hospitalId } as Hospital,
      status: createDto.status ?? AmbulanceStatus.AVAILABLE,
      lastLatitude: createDto.lastLatitude,
      lastLongitude: createDto.lastLongitude,
      lastLocationUpdate: new Date(),
      isActive: createDto.isActive ?? true,
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

  async updateAmbulance(id: string, updateDto: UpdateAmbulanceDto): Promise<Ambulance> {
    const exists = await this.ambulanceRepository.findById(id);
    if (!exists) {
      throw new NotFoundException(`Ambulance with ID ${id} not found`);
    }
    return this.ambulanceRepository.updateAmbulance(id, {
      licensePlate: updateDto.licensePlate,
      type: updateDto.type,
      baseHospital: updateDto.hospitalId ? { id: updateDto.hospitalId } as Hospital : undefined,
      status: updateDto.status,
      lastLatitude: updateDto.lastLatitude,
      lastLongitude: updateDto.lastLongitude,
      // we don't update lastLocationUpdate automatically here; could be set by another service
      isActive: updateDto.isActive,
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