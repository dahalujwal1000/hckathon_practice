import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsDecimal,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDoctorDto {
  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  hospitalId?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  experienceYears?: number;

  @IsOptional()
  @Type(() => Number)
  @IsDecimal({ decimal_digits: '1,2' })
  @Min(0)
  consultationFee?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  availableDays?: string[];
}