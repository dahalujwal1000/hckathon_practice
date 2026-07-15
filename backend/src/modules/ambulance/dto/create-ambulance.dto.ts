import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { AmbulanceType, AmbulanceStatus } from '../entities/ambulance.entity';

export class CreateAmbulanceDto {
  @IsNotEmpty()
  @IsString()
  licensePlate: string;

  @IsNotEmpty()
  @IsEnum(AmbulanceType)
  type: AmbulanceType;

  @IsNotEmpty()
  @IsNumber()
  hospitalId: string; // baseHospitalId

  @IsOptional()
  @IsEnum(AmbulanceStatus)
  status?: AmbulanceStatus = AmbulanceStatus.AVAILABLE;

  @IsOptional()
  @IsNumber()
  lastLatitude?: number;

  @IsOptional()
  @IsNumber()
  lastLongitude?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}