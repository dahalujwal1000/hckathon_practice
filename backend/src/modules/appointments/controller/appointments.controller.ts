import { ForbiddenException } from '@nestjs/common';
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from '../service/appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { QueryAppointmentDto } from '../dto/query-appointment.dto';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { RolesGuard } from 'common/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';
import { CurrentUser } from 'common/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // GET /appointments - Get all appointments with filtering and pagination
  // Access: Admin, Doctor (for their patients), Patient (for their own)
  // We'll handle the filtering in the service based on the current user's role and ID.
  @Get()
  async getAppointments(
    @Query() queryDto: QueryAppointmentDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.appointmentsService.getAppointments(queryDto, currentUser);
  }

  // GET /appointments/:id - Get a specific appointment
  // Access: Patient (if it's their appointment), Doctor (if it's their patient's appointment), Admin
  @Get(':id')
  async getAppointmentById(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.appointmentsService.getAppointmentById(id, currentUser);
  }

  // POST /appointments - Create a new appointment
  // Access: Patient (to book their own), Admin (to book for anyone)
  // Doctors might be able to create appointments for their patients? We'll allow patient and admin for now.
  @Post()
  async createAppointment(
    @Body() createDto: CreateAppointmentDto,
    @CurrentUser() currentUser: User,
  ) {
    // Patients can only create appointments for themselves
    if (currentUser.role === UserRole.PATIENT && currentUser.id !== createDto.patientId) {
      throw new ForbiddenException('Patients can only create appointments for themselves');
    }
    // Admin can create for any patient
    return this.appointmentsService.createAppointment(createDto, currentUser);
  }

  // PATCH /appointments/:id - Update an appointment
  // Access: Patient (if it's their appointment), Doctor (if it's their patient's appointment), Admin
  @Patch(':id')
  async updateAppointment(
    @Param('id') id: string,
    @Body() updateDto: UpdateAppointmentDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.appointmentsService.updateAppointment(id, updateDto, currentUser);
  }

  // DELETE /appointments/:id - Cancel an appointment (soft delete)
  // Access: Patient (if it's their appointment), Doctor (if it's their patient's appointment), Admin
  @Delete(':id')
  async cancelAppointment(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.appointmentsService.cancelAppointment(id, currentUser);
  }

  // Additional endpoints for specific entities

  // GET /appointments/patient/:patientId - Get appointments for a specific patient
  @Get('patient/:patientId')
  async getAppointmentsByPatient(
    @Param('patientId') patientId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.appointmentsService.getAppointmentsByPatient(patientId, currentUser);
  }

  // GET /appointments/doctor/:doctorId - Get appointments for a specific doctor
  @Get('doctor/:doctorId')
  async getAppointmentsByDoctor(
    @Param('doctorId') doctorId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.appointmentsService.getAppointmentsByDoctor(doctorId, currentUser);
  }

  // GET /appointments/hospital/:hospitalId - Get appointments for a specific hospital
  @Get('hospital/:hospitalId')
  async getAppointmentsByHospital(
    @Param('hospitalId') hospitalId: string,
    @CurrentUser() currentUser: User,
  ) {
    return this.appointmentsService.getAppointmentsByHospital(hospitalId, currentUser);
  }
}