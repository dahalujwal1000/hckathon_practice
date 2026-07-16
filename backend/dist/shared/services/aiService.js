"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiHttpService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const operators_1 = require("rxjs/operators");
let AiHttpService = class AiHttpService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
    }
    getOptions() {
        return {
            timeout: this.configService.get('AI_TIMEOUT') || 30000,
            headers: {
                'X-Internal-Token': this.configService.get('FASTAPI_INTERNAL_TOKEN'),
            },
        };
    }
    get(endpoint, params) {
        return this.httpService
            .get(`${this.configService.get('FASTAPI_URL')}${endpoint}`, { params, ...this.getOptions() })
            .pipe((0, operators_1.timeout)(this.getOptions().timeout), (0, operators_1.retry)(3), (0, operators_1.catchError)((error) => {
            throw new common_1.HttpException(error.response?.data?.message || 'AI service unavailable', error.response?.status || common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }))
            .toPromise()
            .then((res) => res.data);
    }
    post(endpoint, data) {
        return this.httpService
            .post(`${this.configService.get('FASTAPI_URL')}${endpoint}`, data, this.getOptions())
            .pipe((0, operators_1.timeout)(this.getOptions().timeout), (0, operators_1.retry)(3), (0, operators_1.catchError)((error) => {
            throw new common_1.HttpException(error.response?.data?.message || 'AI service unavailable', error.response?.status || common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }))
            .toPromise()
            .then((res) => res.data);
    }
    put(endpoint, data) {
        return this.httpService
            .put(`${this.configService.get('FASTAPI_URL')}${endpoint}`, data, this.getOptions())
            .pipe((0, operators_1.timeout)(this.getOptions().timeout), (0, operators_1.retry)(3), (0, operators_1.catchError)((error) => {
            throw new common_1.HttpException(error.response?.data?.message || 'AI service unavailable', error.response?.status || common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }))
            .toPromise()
            .then((res) => res.data);
    }
    delete(endpoint) {
        return this.httpService
            .delete(`${this.configService.get('FASTAPI_URL')}${endpoint}`, this.getOptions())
            .pipe((0, operators_1.timeout)(this.getOptions().timeout), (0, operators_1.retry)(3), (0, operators_1.catchError)((error) => {
            throw new common_1.HttpException(error.response?.data?.message || 'AI service unavailable', error.response?.status || common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }))
            .toPromise()
            .then((res) => res.data);
    }
};
exports.AiHttpService = AiHttpService;
exports.AiHttpService = AiHttpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof common_1.HttpService !== "undefined" && common_1.HttpService) === "function" ? _a : Object, config_1.ConfigService])
], AiHttpService);
//# sourceMappingURL=aiService.js.map