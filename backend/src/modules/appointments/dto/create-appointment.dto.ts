import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsNotEmpty()
  @IsString()
  hospitalId: string;

  @IsDate()
  appointmentDateTime: Date;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}