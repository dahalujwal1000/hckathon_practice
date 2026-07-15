import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationExceptionPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === 'object' && value !== null) {
      // If it's a validation error object from class-validator
      if (Array.isArray(value)) {
        const errors = value.map((error: any) => {
          if (error.constraints) {
            return Object.values(error.constraints).join(', ');
          }
          return Object.values(error.children || {}).join(', ');
        });
        throw new BadRequestException(errors.join('; '));
      }
      if (value.message) {
        throw new BadRequestException(value.message);
      }
    }
    return value;
  }
}
