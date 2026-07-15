import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsPositive,
  IsBoolean,
} from 'class-validator';
import { AmbulanceType, AmbulanceStatus } from '../entities/ambulance.entity';

export class UpdateAmbulanceDto {
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @IsOptional()
  @IsEnum(AmbulanceType)
  type?: AmbulanceType;

  @IsOptional()
  @IsNumber()
  hospitalId?: string;

  @IsOptional()
  @IsEnum(AmbulanceStatus)
  status?: AmbulanceStatus;

  @IsOptional()
  @IsNumber()
  lastLatitude?: number;

  @IsOptional()
  @IsNumber()
  lastLongitude?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}