import { IsString, IsOptional, MaxLength, IsArray, ValidateNested, IsIn, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SymptomsRequestDto {
  @IsString()
  @IsOptional()
  symptoms?: string;

  @IsString()
  @IsOptional()
  patientHistory?: string;

  @IsString()
  @IsOptional()
  patientId?: string;
}

export class ConditionInfoDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(1)
  probability: number;

  @IsString()
  description: string;
}

export class SymptomsResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConditionInfoDto)
  conditions: ConditionInfoDto[];

  @IsArray()
  @IsString({ each: true })
  recommendations: string[];

  @IsIn(['low', 'medium', 'high', 'emergency'])
  urgency: 'low' | 'medium' | 'high' | 'emergency';

  @IsString()
  suggestedCategory: string;
}
