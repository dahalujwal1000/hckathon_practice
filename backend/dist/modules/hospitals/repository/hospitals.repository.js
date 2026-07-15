"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hospital_entity_1 = require("../entities/hospital.entity");
let HospitalsRepository = class HospitalsRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findById(id) {
        return this.repository.findOne({ where: { id } });
    }
    async findAndPaginate(queryDto) {
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
    async createHospital(data) {
        const hospital = this.repository.create(data);
        return this.repository.save(hospital);
    }
    async updateHospital(id, data) {
        await this.repository.update(id, data);
        const updated = await this.repository.findOne({ where: { id } });
        if (!updated) {
            throw new Error('Hospital not found after update');
        }
        return updated;
    }
    async softDelete(id) {
        await this.repository.softDelete({ id });
    }
    async findNearby(latitude, longitude, radiusKm) {
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
};
exports.HospitalsRepository = HospitalsRepository;
exports.HospitalsRepository = HospitalsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hospital_entity_1.Hospital)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HospitalsRepository);
//# sourceMappingURL=hospitals.repository.js.map