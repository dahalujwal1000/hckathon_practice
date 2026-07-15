import {
  IsString,
  IsOptional,
  IsInt,
  Min,
  IsDecimal,
  IsArray,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDoctorDto {
  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  hospitalId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minExperience?: number;

  @IsOptional()
  @Type(() => Number)
  @IsDecimal({ decimal_digits: '1,2' })
  @Min(0)
  maxFee?: number;

  @IsOptional()
  @IsString()
  availableDay?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}