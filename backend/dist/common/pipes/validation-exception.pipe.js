"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationExceptionPipe = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
let ValidationExceptionPipe = class ValidationExceptionPipe {
    async transform(value, metadata) {
        if (metadata.type !== 'body' && metadata.type !== 'query' && metadata.type !== 'param') {
            return value;
        }
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = (0, class_transformer_1.plainToInstance)(metatype, value);
        const errors = await (0, class_validator_1.validate)(object);
        if (errors.length > 0) {
            const messages = this.getErrorMessages(errors);
            throw new common_1.BadRequestException({
                message: 'Validation failed',
                errors: messages,
            });
        }
        return value;
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
    getErrorMessages(errors) {
        return errors.map((error) => {
            if (error.constraints) {
                return Object.values(error.constraints).join(', ');
            }
            return Object.values(this.getErrorMessages(error.children ?? [])).join(', ');
        });
    }
};
exports.ValidationExceptionPipe = ValidationExceptionPipe;
exports.ValidationExceptionPipe = ValidationExceptionPipe = __decorate([
    (0, common_1.Injectable)()
], ValidationExceptionPipe);
//# sourceMappingURL=validation-exception.pipe.js.map