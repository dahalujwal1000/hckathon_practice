import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsEnum,
} from 'class-validator';
import { HospitalType } from '../entities/hospital.entity';

export class QueryHospitalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(HospitalType)
  type?: HospitalType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  minRating?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  maxRating?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  @IsInt()
  limit?: number = 10;
}