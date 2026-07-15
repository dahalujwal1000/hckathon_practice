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
exports.DoctorsController = void 0;
const common_1 = require("@nestjs/common");
const doctors_service_1 = require("./service/doctors.service");
const create_doctor_dto_1 = require("./dto/create-doctor.dto");
const update_doctor_dto_1 = require("./dto/update-doctor.dto");
const query_doctor_dto_1 = require("./dto/query-doctor.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_entity_1 = require("../../users/entities/user.entity");
let DoctorsController = class DoctorsController {
    doctorsService;
    constructor(doctorsService) {
        this.doctorsService = doctorsService;
    }
    async getDoctors(queryDto) {
        const [data, total] = await this.doctorsService.getDoctors(queryDto);
        return {
            data,
            meta: {
                page: queryDto.page,
                limit: queryDto.limit,
                total,
            },
        };
    }
    async getDoctorById(id) {
        return this.doctorsService.getDoctorById(id);
    }
    async createDoctor(createDto) {
        return this.doctorsService.createDoctor(createDto);
    }
    async updateDoctor(id, updateDto) {
        return this.doctorsService.updateDoctor(id, updateDto);
    }
    async deleteDoctor(id) {
        await this.doctorsService.deleteDoctor(id);
        return { message: 'Doctor deleted successfully' };
    }
};
exports.DoctorsController = DoctorsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof query_doctor_dto_1.QueryDoctorDto !== "undefined" && query_doctor_dto_1.QueryDoctorDto) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getDoctors", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "getDoctorById", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_doctor_dto_1.CreateDoctorDto !== "undefined" && create_doctor_dto_1.CreateDoctorDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "createDoctor", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_d = typeof update_doctor_dto_1.UpdateDoctorDto !== "undefined" && update_doctor_dto_1.UpdateDoctorDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "updateDoctor", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DoctorsController.prototype, "deleteDoctor", null);
exports.DoctorsController = DoctorsController = __decorate([
    (0, common_1.Controller)('doctors'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [typeof (_a = typeof doctors_service_1.DoctorsService !== "undefined" && doctors_service_1.DoctorsService) === "function" ? _a : Object])
], DoctorsController);
//# sourceMappingURL=doctors.controller.js.map