import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { HospitalType } from '../entities/hospital.entity';

export class UpdateHospitalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsEnum(HospitalType)
  type?: HospitalType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  rating?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  establishedYear?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}