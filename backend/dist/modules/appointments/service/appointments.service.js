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
exports.AppointmentsService = void 0;
const common_1 = require("@nestjs/common");
const appointments_repository_1 = require("./repository/appointments.repository");
const user_entity_1 = require("../../users/entities/user.entity");
const doctors_repository_1 = require("../../doctors/repository/doctors.repository");
const hospitals_repository_1 = require("../../hospitals/repository/hospitals.repository");
const users_repository_1 = require("../../users/repository/users.repository");
const email_service_1 = require("../../../shared/services/email.service");
let AppointmentsService = class AppointmentsService {
    constructor(appointmentsRepository, doctorsRepository, hospitalsRepository, usersRepository, emailService) {
        this.appointmentsRepository = appointmentsRepository;
        this.doctorsRepository = doctorsRepository;
        this.hospitalsRepository = hospitalsRepository;
        this.usersRepository = usersRepository;
        this.emailService = emailService;
    }
    async getAppointments(queryDto, currentUser) {
        return this.appointmentsRepository.findAndPaginate(queryDto, currentUser);
    }
    async getAppointmentById(id, currentUser) {
        const appointment = await this.appointmentsRepository.findById(id);
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
        }
        const isPatient = currentUser.id === appointment.patientId;
        let isDoctor = false;
        if (currentUser.role === user_entity_1.UserRole.DOCTOR) {
            const doctor = await this.doctorsRepository.findById(appointment.doctorId);
            isDoctor = doctor && doctor.userId === currentUser.id;
        }
        const isAdmin = currentUser.role === user_entity_1.UserRole.ADMIN;
        if (!isPatient && !isDoctor && !isAdmin) {
            throw new common_1.ForbiddenException('You do not have permission to view this appointment');
        }
        return appointment;
    }
    async createAppointment(createDto, currentUser) {
        const patientExists = await this.validatePatient(createDto.patientId);
        if (!patientExists) {
            throw new common_1.NotFoundException(`Patient with ID ${createDto.patientId} not found`);
        }
        const doctorExists = await this.validateDoctor(createDto.doctorId);
        if (!doctorExists) {
            throw new common_1.NotFoundException(`Doctor with ID ${createDto.doctorId} not found`);
        }
        const hospitalExists = await this.validateHospital(createDto.hospitalId);
        if (!hospitalExists) {
            throw new common_1.NotFoundException(`Hospital with ID ${createDto.hospitalId} not found`);
        }
        if (currentUser.role === user_entity_1.UserRole.PATIENT && currentUser.id !== createDto.patientId) {
            throw new common_1.ForbiddenException('Patients can only create appointments for themselves');
        }
        const appointment = await this.appointmentsRepository.createAppointment({
            patientId: createDto.patientId,
            doctorId: createDto.doctorId,
            hospitalId: createDto.hospitalId,
            appointmentDateTime: new Date(createDto.appointmentDateTime),
            status: createDto.status || 'scheduled',
            notes: createDto.notes,
        });
        const [patient, doctor, hospital] = await Promise.all([
            this.usersRepository.findById(createDto.patientId),
            this.doctorsRepository.findById(createDto.doctorId),
            this.hospitalsRepository.findById(createDto.hospitalId),
        ]);
        this.emailService
            .sendAppointmentConfirmation(patient.email, patient.name, {
            doctorName: doctor.name,
            hospitalName: hospital.name,
            appointmentDateTime: appointment.appointmentDateTime,
            status: appointment.status,
            notes: appointment.notes,
        })
            .catch((error) => {
            console.error('Failed to send appointment confirmation email:', error);
        });
        return appointment;
    }
    async updateAppointment(id, updateDto, currentUser) {
        const appointment = await this.appointmentsRepository.findById(id);
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
        }
        const isPatient = currentUser.id === appointment.patientId;
        let isDoctor = false;
        if (currentUser.role === user_entity_1.UserRole.DOCTOR) {
            const doctor = await this.doctorsRepository.findById(appointment.doctorId);
            isDoctor = doctor && doctor.userId === currentUser.id;
        }
        const isAdmin = currentUser.role === user_entity_1.UserRole.ADMIN;
        if (!isPatient && !isDoctor && !isAdmin) {
            throw new common_1.ForbiddenException('You do not have permission to update this appointment');
        }
        if (updateDto.doctorId) {
            const doctorExists = await this.validateDoctor(updateDto.doctorId);
            if (!doctorExists) {
                throw new common_1.NotFoundException(`Doctor with ID ${updateDto.doctorId} not found`);
            }
        }
        if (updateDto.hospitalId) {
            const hospitalExists = await this.validateHospital(updateDto.hospitalId);
            if (!hospitalExists) {
                throw new common_1.NotFoundException(`Hospital with ID ${updateDto.hospitalId} not found`);
            }
        }
        const updateData = {};
        if (updateDto.patientId !== undefined) {
            if (currentUser.role !== user_entity_1.UserRole.ADMIN) {
                throw new common_1.ForbiddenException('Only administrators can change the patient for an appointment');
            }
            const patientExists = await this.validatePatient(updateDto.patientId);
            if (!patientExists) {
                throw new common_1.NotFoundException(`Patient with ID ${updateDto.patientId} not found`);
            }
            updateData.patientId = updateDto.patientId;
        }
        if (updateDto.doctorId !== undefined) {
            updateData.doctorId = updateDto.doctorId;
        }
        if (updateDto.hospitalId !== undefined) {
            updateData.hospitalId = updateDto.hospitalId;
        }
        if (updateDto.appointmentDateTime !== undefined) {
            updateData.appointmentDateTime = new Date(updateDto.appointmentDateTime);
        }
        if (updateDto.status !== undefined) {
            updateData.status = updateDto.status;
        }
        if (updateDto.notes !== undefined) {
            updateData.notes = updateDto.notes;
        }
        return this.appointmentsRepository.updateAppointment(id, updateData);
    }
    async cancelAppointment(id, currentUser) {
        const appointment = await this.appointmentsRepository.findById(id);
        if (!appointment) {
            throw new common_1.NotFoundException(`Appointment with ID ${id} not found`);
        }
        const isPatient = currentUser.id === appointment.patientId;
        let isDoctor = false;
        if (currentUser.role === user_entity_1.UserRole.DOCTOR) {
            const doctor = await this.doctorsRepository.findById(appointment.doctorId);
            isDoctor = doctor && doctor.userId === currentUser.id;
        }
        const isAdmin = currentUser.role === user_entity_1.UserRole.ADMIN;
        if (!isPatient && !isDoctor && !isAdmin) {
            throw new common_1.ForbiddenException('You do not have permission to cancel this appointment');
        }
        await this.appointmentsRepository.softDelete(id);
    }
    async getAppointmentsByPatient(patientId, currentUser) {
        const isPatient = currentUser.id === patientId;
        const isAdmin = currentUser.role === user_entity_1.UserRole.ADMIN;
        if (!isPatient && !isAdmin && currentUser.role !== user_entity_1.UserRole.DOCTOR) {
            throw new common_1.ForbiddenException('You do not have permission to view these appointments');
        }
        let appointments = await this.appointmentsRepository.findByPatientId(patientId);
        if (currentUser.role === user_entity_1.UserRole.DOCTOR && !isPatient && !isAdmin) {
            appointments = await Promise.all(appointments.map(async (appointment) => {
                const doctor = await this.doctorsRepository.findById(appointment.doctorId);
                return doctor && doctor.userId === currentUser.id ? appointment : null;
            })).then((results) => results.filter((appt) => appt !== null));
        }
        return appointments;
    }
    async getAppointmentsByDoctor(doctorId, currentUser) {
        const isDoctor = await this.isDoctorForDoctorId(doctorId, currentUser);
        const isAdmin = currentUser.role === user_entity_1.UserRole.ADMIN;
        if (!isDoctor && !isAdmin) {
            throw new common_1.ForbiddenException('You do not have permission to view these appointments');
        }
        return this.appointmentsRepository.findByDoctorId(doctorId);
    }
    async getAppointmentsByHospital(hospitalId, currentUser) {
        return this.appointmentsRepository.findByHospitalId(hospitalId, currentUser);
    }
    async validatePatient(patientId) {
        const patient = await this.usersRepository.findById(patientId);
        return !!patient && patient.role === user_entity_1.UserRole.PATIENT;
    }
    async validateDoctor(doctorId) {
        const doctor = await this.doctorsRepository.findById(doctorId);
        return !!doctor;
    }
    async validateHospital(hospitalId) {
        const hospital = await this.hospitalsRepository.findById(hospitalId);
        return !!hospital;
    }
    async isDoctorForDoctorId(doctorId, currentUser) {
        if (currentUser.role !== user_entity_1.UserRole.DOCTOR) {
            return false;
        }
        const doctor = await this.doctorsRepository.findById(doctorId);
        return !!doctor && doctor.userId === currentUser.id;
    }
};
exports.AppointmentsService = AppointmentsService;
exports.AppointmentsService = AppointmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof appointments_repository_1.AppointmentsRepository !== "undefined" && appointments_repository_1.AppointmentsRepository) === "function" ? _a : Object, doctors_repository_1.DoctorsRepository,
        hospitals_repository_1.HospitalsRepository,
        users_repository_1.UsersRepository,
        email_service_1.EmailService])
], AppointmentsService);
//# sourceMappingURL=appointments.service.js.map