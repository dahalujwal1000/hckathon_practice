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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HospitalsController = void 0;
const common_1 = require("@nestjs/common");
const hospitals_service_1 = require("./service/hospitals.service");
const create_hospital_dto_1 = require("./dto/create-hospital.dto");
const update_hospital_dto_1 = require("./dto/update-hospital.dto");
const query_hospital_dto_1 = require("./dto/query-hospital.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
let HospitalsController = class HospitalsController {
    hospitalsService;
    constructor(hospitalsService) {
        this.hospitalsService = hospitalsService;
    }
    async getHospitals(queryDto) {
        const [data, total] = await this.hospitalsService.getHospitals(queryDto);
        return {
            data,
            meta: {
                page: queryDto.page,
                limit: queryDto.limit,
                total,
            },
        };
    }
    async getHospitalById(id) {
        return this.hospitalsService.getHospitalById(id);
    }
    async getNearby(latitude, longitude, distance = 10) {
        return this.hospitalsService.getNearbyHospitals(Number(latitude), Number(longitude), Number(distance));
    }
    async createHospital(createDto) {
        return this.hospitalsService.createHospital(createDto);
    }
    async updateHospital(id, updateDto) {
        return this.hospitalsService.updateHospital(id, updateDto);
    }
    async deleteHospital(id) {
        await this.hospitalsService.deleteHospital(id);
        return { message: 'Hospital deleted successfully' };
    }
};
exports.HospitalsController = HospitalsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof query_hospital_dto_1.QueryHospitalDto !== "undefined" && query_hospital_dto_1.QueryHospitalDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], HospitalsController.prototype, "getHospitals", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HospitalsController.prototype, "getHospitalById", null);
__decorate([
    (0, common_1.Get)('near'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('distance')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], HospitalsController.prototype, "getNearby", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_hospital_dto_1.CreateHospitalDto !== "undefined" && create_hospital_dto_1.CreateHospitalDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], HospitalsController.prototype, "createHospital", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof update_hospital_dto_1.UpdateHospitalDto !== "undefined" && update_hospital_dto_1.UpdateHospitalDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], HospitalsController.prototype, "updateHospital", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HospitalsController.prototype, "deleteHospital", null);
exports.HospitalsController = HospitalsController = __decorate([
    (0, common_1.Controller)('hospitals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof hospitals_service_1.HospitalsService !== "undefined" && hospitals_service_1.HospitalsService) === "function" ? _a : Object])
], HospitalsController);
//# sourceMappingURL=hospitals.controller.js.map