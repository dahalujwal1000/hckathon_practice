import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { AmbulanceType, AmbulanceStatus } from '../entities/ambulance.entity';

export class QueryAmbulanceDto {
  @IsOptional()
  @IsEnum(AmbulanceType)
  type?: AmbulanceType;

  @IsOptional()
  @IsEnum(AmbulanceStatus)
  status?: AmbulanceStatus;

  @IsOptional()
  @IsString()
  hospitalId?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit?: number = 10;
}