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
exports.AppointmentsRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const appointment_entity_1 = require("./entities/appointment.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let AppointmentsRepository = class AppointmentsRepository {
    constructor(repository) {
        this.repository = repository;
    }
    async findById(id) {
        return this.repository.findOne({ where: { id }, relations: ['patient', 'doctor', 'hospital'] });
    }
    async findAndPaginate(queryDto, currentUser) {
        const { page = 1, limit = 10, status, doctorId, patientId, hospitalId, appointmentDateFrom, appointmentDateTo } = queryDto;
        const qb = this.repository.createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.patient', 'patient')
            .leftJoinAndSelect('appointment.doctor', 'doctor')
            .leftJoinAndSelect('appointment.hospital', 'hospital');
        if (currentUser.role === user_entity_1.UserRole.PATIENT) {
            qb.andWhere('appointment.patientId = :patientId', { patientId: currentUser.id });
        }
        else if (currentUser.role === user_entity_1.UserRole.DOCTOR) {
            qb.leftJoin('doctor.user', 'doctorUser')
                .andWhere('doctorUser.id = :userId', { userId: currentUser.id });
        }
        if (status) {
            qb.andWhere('appointment.status = :status', { status });
        }
        if (doctorId) {
            qb.andWhere('appointment.doctorId = :doctorId', { doctorId });
        }
        if (patientId) {
            qb.andWhere('appointment.patientId = :patientId', { patientId });
        }
        if (hospitalId) {
            qb.andWhere('appointment.hospitalId = :hospitalId', { hospitalId });
        }
        if (appointmentDateFrom) {
            qb.andWhere('appointment.appointmentDateTime >= :appointmentDateFrom', { appointmentDateFrom });
        }
        if (appointmentDateTo) {
            qb.andWhere('appointment.appointmentDateTime <= :appointmentDateTo', { appointmentDateTo });
        }
        const [data, total] = await qb
            .orderBy('appointment.appointmentDateTime', 'ASC')
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return [data, total];
    }
    async createAppointment(data) {
        const appointment = this.repository.create(data);
        return this.repository.save(appointment);
    }
    async updateAppointment(id, data) {
        await this.repository.update(id, data);
        const updated = await this.repository.findOne({ where: { id }, relations: ['patient', 'doctor', 'hospital'] });
        if (!updated) {
            throw new Error('Appointment not found after update');
        }
        return updated;
    }
    async softDelete(id) {
        await this.repository.softDelete({ id });
    }
    async findByPatientId(patientId) {
        return this.repository.find({
            where: { patientId },
            relations: ['doctor', 'hospital'],
            order: { appointmentDateTime: 'ASC' },
        });
    }
    async findByDoctorId(doctorId) {
        return this.repository.find({
            where: { doctorId },
            relations: ['patient', 'hospital'],
            order: { appointmentDateTime: 'ASC' },
        });
    }
    async findByHospitalId(hospitalId, currentUser) {
        const qb = this.repository.createQueryBuilder('appointment')
            .leftJoinAndSelect('appointment.patient', 'patient')
            .leftJoinAndSelect('appointment.doctor', 'doctor')
            .where('appointment.hospitalId = :hospitalId', { hospitalId });
        if (currentUser.role === user_entity_1.UserRole.PATIENT) {
            qb.andWhere('appointment.patientId = :patientId', { patientId: currentUser.id });
        }
        else if (currentUser.role === user_entity_1.UserRole.DOCTOR) {
            qb.leftJoin('doctor.user', 'doctorUser')
                .andWhere('doctorUser.id = :userId', { userId: currentUser.id });
        }
        return qb.getMany();
    }
};
exports.AppointmentsRepository = AppointmentsRepository;
exports.AppointmentsRepository = AppointmentsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(appointment_entity_1.Appointment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AppointmentsRepository);
//# sourceMappingURL=appointments.repository.js.map