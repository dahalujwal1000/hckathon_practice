import { PipeTransform, BadRequestException, Injectable, ArgumentMetadata } from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationExceptionPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (metadata.type !== 'body' && metadata.type !== 'query' && metadata.type !== 'param') {
      return value;
    }

    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const messages = this.getErrorMessages(errors);
      throw new BadRequestException({
        message: 'Validation failed',
        errors: messages,
      });
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private getErrorMessages(errors: ValidationError[]): string[] {
    return errors.map((error) => {
      if (error.constraints) {
        return Object.values(error.constraints).join(', ');
      }
      return Object.values(this.getErrorMessages(error.children ?? [])).join(', ');
    });
  }
}