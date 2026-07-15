import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { HospitalType } from '../entities/hospital.entity';

export class CreateHospitalDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsNotEmpty()
  @IsEnum(HospitalType)
  type: HospitalType;

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
  isActive?: boolean = true;
}