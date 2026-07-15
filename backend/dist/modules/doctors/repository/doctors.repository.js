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
exports.DoctorsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const doctor_entity_1 = require("../entities/doctor.entity");
let DoctorsRepository = class DoctorsRepository {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async findById(id) {
        return this.repository.findOne({ where: { id } });
    }
    async findAndPaginate(queryDto) {
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
            qb.andWhere('doctor.availableDays @> ARRAY[:availableDay]::text[]', { availableDay });
        }
        const [data, total] = await qb
            .orderBy('doctor.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return [data, total];
    }
    async createDoctor(data) {
        const doc = this.repository.create(data);
        return this.repository.save(doc);
    }
    async updateDoctor(id, data) {
        await this.repository.update(id, data);
        const updated = await this.repository.findOne({ where: { id } });
        if (!updated) {
            throw new Error('Doctor not found after update');
        }
        return updated;
    }
    async softDelete(id) {
        await this.repository.softDelete({ id });
    }
};
exports.DoctorsRepository = DoctorsRepository;
exports.DoctorsRepository = DoctorsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(doctor_entity_1.Doctor)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DoctorsRepository);
//# sourceMappingURL=doctors.repository.js.map