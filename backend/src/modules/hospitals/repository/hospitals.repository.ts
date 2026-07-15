import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hospital } from '../entities/hospital.entity';
import { QueryHospitalDto } from '../dto/query-hospital.dto';

@Injectable()
export class HospitalsRepository {
  constructor(
    @InjectRepository(Hospital)
    private readonly repository: Repository<Hospital>,
  ) {}

  async findById(id: string): Promise<Hospital | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findAndPaginate(queryDto: QueryHospitalDto): Promise<[Hospital[], number]> {
    const { page = 1, limit = 10, name, type, minRating, maxRating } = queryDto;

    const qb = this.repository.createQueryBuilder('hospital');

    if (name) {
      qb.andWhere('hospital.name LIKE :name', { name: `%${name}%` });
    }
    if (type) {
      qb.andWhere('hospital.type = :type', { type });
    }
    if (minRating !== undefined) {
      qb.andWhere('hospital.rating >= :minRating', { minRating });
    }
    if (maxRating !== undefined) {
      qb.andWhere('hospital.rating <= :maxRating', { maxRating });
    }

    const [data, total] = await qb
      .orderBy('hospital.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return [data, total];
  }

  async createHospital(data: Partial<Hospital>): Promise<Hospital> {
    const hospital = this.repository.create(data);
    return this.repository.save(hospital);
  }

  async updateHospital(id: string, data: Partial<Hospital>): Promise<Hospital> {
    await this.repository.update(id, data);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('Hospital not found after update');
    }
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete({ id });
  }

  async findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number,
  ): Promise<Hospital[]> {
    const earthRadiusKm = 6371;

    const sql = `
      SELECT *,
        ${earthRadiusKm} * acos(
          cos(radians(:lat)) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(:lng)) +
          sin(radians(:lat)) * sin(radians(latitude))
        ) AS distance
      FROM hospital
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