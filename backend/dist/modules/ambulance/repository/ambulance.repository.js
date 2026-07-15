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
exports.AmbulanceRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ambulance_entity_1 = require("../entities/ambulance.entity");
let AmbulanceRepository = class AmbulanceRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findById(id) {
        return this.repository.findOne({ where: { id } });
    }
    async findAndPaginate(queryDto) {
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
    async createAmbulance(data) {
        const ambulance = this.repository.create(data);
        return this.repository.save(ambulance);
    }
    async updateAmbulance(id, data) {
        await this.repository.update(id, data);
        const updated = await this.repository.findOne({ where: { id } });
        if (!updated) {
            throw new Error('Ambulance not found after update');
        }
        return updated;
    }
    async softDelete(id) {
        await this.repository.softDelete({ id });
    }
    async findByHospitalId(hospitalId) {
        return this.repository.find({ where: { hospitalId } });
    }
    async findNearby(latitude, longitude, radiusKm) {
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
};
exports.AmbulanceRepository = AmbulanceRepository;
exports.AmbulanceRepository = AmbulanceRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ambulance_entity_1.Ambulance)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AmbulanceRepository);
//# sourceMappingURL=ambulance.repository.js.map