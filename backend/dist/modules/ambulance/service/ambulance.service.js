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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbulanceService = void 0;
const common_1 = require("@nestjs/common");
const ambulance_repository_1 = require("../repository/ambulance.repository");
const ambulance_entity_1 = require("../entities/ambulance.entity");
let AmbulanceService = class AmbulanceService {
    constructor(ambulanceRepository) {
        this.ambulanceRepository = ambulanceRepository;
    }
    async createAmbulance(dto) {
        return this.ambulanceRepository.createAmbulance({
            licensePlate: dto.licensePlate,
            type: dto.type,
            baseHospital: { id: dto.hospitalId },
            status: dto.status ?? ambulance_entity_1.AmbulanceStatus.AVAILABLE,
            lastLatitude: dto.lastLatitude,
            lastLongitude: dto.lastLongitude,
            lastLocationUpdate: new Date(),
            isActive: dto.isActive ?? true,
        });
    }
    async getAmbulances(queryDto) {
        return this.ambulanceRepository.findAndPaginate(queryDto);
    }
    async getAmbulanceById(id) {
        const ambulance = await this.ambulanceRepository.findById(id);
        if (!ambulance) {
            throw new common_1.NotFoundException(`Ambulance with ID ${id} not found`);
        }
        return ambulance;
    }
    async updateAmbulance(id, dto) {
        const exists = await this.ambulanceRepository.findById(id);
        if (!exists) {
            throw new common_1.NotFoundException(`Ambulance with ID ${id} not found`);
        }
        return this.ambulanceRepository.updateAmbulance(id, {
            licensePlate: dto.licensePlate,
            type: dto.type,
            baseHospital: dto.hospitalId ? { id: dto.hospitalId } : undefined,
            status: dto.status,
            lastLatitude: dto.lastLatitude,
            lastLongitude: dto.lastLongitude,
            isActive: dto.isActive,
        });
    }
    async deleteAmbulance(id) {
        const exists = await this.ambulanceRepository.findById(id);
        if (!exists) {
            throw new common_1.NotFoundException(`Ambulance with ID ${id} not found`);
        }
        await this.ambulanceRepository.softDelete(id);
    }
    async getAmbulancesByHospitalId(hospitalId) {
        return this.ambulanceRepository.findByHospitalId(hospitalId);
    }
    async getNearbyAmbulances(latitude, longitude, radiusKm) {
        return this.ambulanceRepository.findNearby(latitude, longitude, radiusKm);
    }
};
exports.AmbulanceService = AmbulanceService;
exports.AmbulanceService = AmbulanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ambulance_repository_1.AmbulanceRepository])
], AmbulanceService);
//# sourceMappingURL=ambulance.service.js.map