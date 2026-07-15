import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ambulance } from '../entities/ambulance.entity';
import { QueryAmbulanceDto } from '../dto/query-ambulance.dto';

@Injectable()
export class AmbulanceRepository {
  constructor(
    @InjectRepository(Ambulance)
    private readonly repository: Repository<Ambulance>,
  ) {}

  async findById(id: string): Promise<Ambulance | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAndPaginate(queryDto: QueryAmbulanceDto): Promise<[Ambulance[], number]> {
    const { page = 1, limit = 10, type, status, hospitalId } = queryDto;

    const qb = this.repository.createQueryBuilder('ambulance');

    if (type) {
      qb.andWhere('ambulance.type = :type', { type });
    }
    if (status) {
      qb.andWhere('ambulance.status = :status', { status });
    }
    if (hospitalId) {
      qb.andWhere('ambulance.hospitalId = :hospitalId', { hospitalId });
    }

    const [data, total] = await qb
      .orderBy('ambulance.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return [data, total];
  }

  async createAmbulance(data: Partial<Ambulance>): Promise<Ambulance> {
    const ambulance = this.repository.create(data);
    return this.repository.save(ambulance);
  }

  async updateAmbulance(id: string, data: Partial<Ambulance>): Promise<Ambulance> {
    await this.repository.update(id, data);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Ambulance not found after update');
    }
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete({ id });
  }

  async findByHospitalId(hospitalId: string): Promise<Ambulance[]> {
    return this.repository.find({ where: { hospitalId } });
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): Promise<Ambulance[]> {
    const earthRadiusKm = 6371;

    const sql = `
      SELECT *,
        ${earthRadiusKm} * acos(
          cos(radians(:lat)) * cos(radians("lastLatitude")) *
          cos(radians("lastLongitude") - radians(:lng)) +
          sin(radians(:lat)) * sin(radians("lastLatitude"))
        ) AS distance
      FROM ambulance
      WHERE "lastLatitude" IS NOT NULL AND "lastLongitude" IS NOT NULL
      HAVING distance < :radius
      ORDER BY distance
    `;

    return this.repository.query(sql, {
      lat: latitude,
      lng: longitude,
      radius: radiusKm,
    });
  }
}