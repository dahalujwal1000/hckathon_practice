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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsService = void 0;
const common_1 = require("@nestjs/common");
const doctors_repository_1 = require("./repository/doctors.repository");
let DoctorsService = class DoctorsService {
    constructor(doctorsRepository) {
        this.doctorsRepository = doctorsRepository;
    }
    async createDoctor(dto) {
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
    async getDoctors(queryDto) {
        return this.doctorsRepository.findAndPaginate(queryDto);
    }
    async getDoctorById(id) {
        const doctor = await this.doctorsRepository.findById(id);
        if (!doctor) {
            throw new common_1.NotFoundException(`Doctor with ID ${id} not found`);
        }
        return doctor;
    }
    async updateDoctor(id, dto) {
        const exists = await this.doctorsRepository.findById(id);
        if (!exists) {
            throw new common_1.NotFoundException(`Doctor with ID ${id} not found`);
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
    async deleteDoctor(id) {
        const exists = await this.doctorsRepository.findById(id);
        if (!exists) {
            throw new common_1.NotFoundException(`Doctor with ID ${id} not found`);
        }
        await this.doctorsRepository.softDelete(id);
    }
};
exports.DoctorsService = DoctorsService;
exports.DoctorsService = DoctorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof doctors_repository_1.DoctorsRepository !== "undefined" && doctors_repository_1.DoctorsRepository) === "function" ? _a : Object])
], DoctorsService);
//# sourceMappingURL=doctors.service.js.map