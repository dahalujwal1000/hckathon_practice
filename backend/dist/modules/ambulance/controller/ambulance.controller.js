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
exports.AmbulanceController = void 0;
const common_1 = require("@nestjs/common");
const ambulance_service_1 = require("../service/ambulance.service");
const create_ambulance_dto_1 = require("../dto/create-ambulance.dto");
const update_ambulance_dto_1 = require("../dto/update-ambulance.dto");
const query_ambulance_dto_1 = require("../dto/query-ambulance.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
let AmbulanceController = class AmbulanceController {
    constructor(ambulanceService) {
        this.ambulanceService = ambulanceService;
    }
    async getAmbulances(queryDto) {
        const [data, total] = await this.ambulanceService.getAmbulances(queryDto);
        return {
            data,
            meta: {
                page: queryDto.page,
                limit: queryDto.limit,
                total,
            },
        };
    }
    async getAmbulanceById(id) {
        return this.ambulanceService.getAmbulanceById(id);
    }
    async getNearby(latitude, longitude, distance = 10) {
        return this.ambulanceService.getNearbyAmbulances(Number(latitude), Number(longitude), Number(distance));
    }
    async getByHospital(hospitalId) {
        return this.ambulanceService.getAmbulancesByHospitalId(hospitalId);
    }
    async createAmbulance(createDto) {
        return this.ambulanceService.createAmbulance(createDto);
    }
    async updateAmbulance(id, updateDto) {
        return this.ambulanceService.updateAmbulance(id, updateDto);
    }
    async deleteAmbulance(id) {
        await this.ambulanceService.deleteAmbulance(id);
        return { message: 'Ambulance deleted successfully' };
    }
};
exports.AmbulanceController = AmbulanceController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_ambulance_dto_1.QueryAmbulanceDto]),
    __metadata("design:returntype", Promise)
], AmbulanceController.prototype, "getAmbulances", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmbulanceController.prototype, "getAmbulanceById", null);
__decorate([
    (0, common_1.Get)('near'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('distance')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], AmbulanceController.prototype, "getNearby", null);
__decorate([
    (0, common_1.Get)('hospital/:hospitalId'),
    __param(0, (0, common_1.Param)('hospitalId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmbulanceController.prototype, "getByHospital", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ambulance_dto_1.CreateAmbulanceDto]),
    __metadata("design:returntype", Promise)
], AmbulanceController.prototype, "createAmbulance", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, transform: true })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_ambulance_dto_1.UpdateAmbulanceDto]),
    __metadata("design:returntype", Promise)
], AmbulanceController.prototype, "updateAmbulance", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AmbulanceController.prototype, "deleteAmbulance", null);
exports.AmbulanceController = AmbulanceController = __decorate([
    (0, common_1.Controller)('ambulances'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [ambulance_service_1.AmbulanceService])
], AmbulanceController);
//# sourceMappingURL=ambulance.controller.js.map