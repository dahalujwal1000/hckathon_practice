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
exports.AppointmentsController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const appointments_service_1 = require("../service/appointments.service");
const create_appointment_dto_1 = require("../dto/create-appointment.dto");
const update_appointment_dto_1 = require("../dto/update-appointment.dto");
const query_appointment_dto_1 = require("../dto/query-appointment.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const user_entity_1 = require("../../users/entities/user.entity");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const user_entity_2 = require("../../users/entities/user.entity");
let AppointmentsController = class AppointmentsController {
    constructor(appointmentsService) {
        this.appointmentsService = appointmentsService;
    }
    async getAppointments(queryDto, currentUser) {
        return this.appointmentsService.getAppointments(queryDto, currentUser);
    }
    async getAppointmentById(id, currentUser) {
        return this.appointmentsService.getAppointmentById(id, currentUser);
    }
    async createAppointment(createDto, currentUser) {
        if (currentUser.role === user_entity_1.UserRole.PATIENT && currentUser.id !== createDto.patientId) {
            throw new common_1.ForbiddenException('Patients can only create appointments for themselves');
        }
        return this.appointmentsService.createAppointment(createDto, currentUser);
    }
    async updateAppointment(id, updateDto, currentUser) {
        return this.appointmentsService.updateAppointment(id, updateDto, currentUser);
    }
    async cancelAppointment(id, currentUser) {
        return this.appointmentsService.cancelAppointment(id, currentUser);
    }
    async getAppointmentsByPatient(patientId, currentUser) {
        return this.appointmentsService.getAppointmentsByPatient(patientId, currentUser);
    }
    async getAppointmentsByDoctor(doctorId, currentUser) {
        return this.appointmentsService.getAppointmentsByDoctor(doctorId, currentUser);
    }
    async getAppointmentsByHospital(hospitalId, currentUser) {
        return this.appointmentsService.getAppointmentsByHospital(hospitalId, currentUser);
    }
};
exports.AppointmentsController = AppointmentsController;
__decorate([
    (0, common_2.Get)(),
    __param(0, (0, common_2.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_appointment_dto_1.QueryAppointmentDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointments", null);
__decorate([
    (0, common_2.Get)(':id'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentById", null);
__decorate([
    (0, common_2.Post)(),
    __param(0, (0, common_2.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_appointment_dto_1.CreateAppointmentDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "createAppointment", null);
__decorate([
    (0, common_2.Patch)(':id'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_appointment_dto_1.UpdateAppointmentDto,
        user_entity_2.User]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "updateAppointment", null);
__decorate([
    (0, common_2.Delete)(':id'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "cancelAppointment", null);
__decorate([
    (0, common_2.Get)('patient/:patientId'),
    __param(0, (0, common_2.Param)('patientId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentsByPatient", null);
__decorate([
    (0, common_2.Get)('doctor/:doctorId'),
    __param(0, (0, common_2.Param)('doctorId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentsByDoctor", null);
__decorate([
    (0, common_2.Get)('hospital/:hospitalId'),
    __param(0, (0, common_2.Param)('hospitalId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_entity_2.User]),
    __metadata("design:returntype", Promise)
], AppointmentsController.prototype, "getAppointmentsByHospital", null);
exports.AppointmentsController = AppointmentsController = __decorate([
    (0, common_2.Controller)('appointments'),
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [appointments_service_1.AppointmentsService])
], AppointmentsController);
//# sourceMappingURL=appointments.controller.js.map