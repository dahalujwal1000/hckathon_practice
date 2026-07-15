"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmbulanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ambulance_entity_1 = require("./entities/ambulance.entity");
const ambulance_controller_1 = require("./controller/ambulance.controller");
const ambulance_service_1 = require("./service/ambulance.service");
const ambulance_repository_1 = require("./repository/ambulance.repository");
let AmbulanceModule = class AmbulanceModule {
};
exports.AmbulanceModule = AmbulanceModule;
exports.AmbulanceModule = AmbulanceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ambulance_entity_1.Ambulance])],
        controllers: [ambulance_controller_1.AmbulanceController],
        providers: [ambulance_service_1.AmbulanceService, ambulance_repository_1.AmbulanceRepository],
        exports: [ambulance_service_1.AmbulanceService],
    })
], AmbulanceModule);
//# sourceMappingURL=ambulance.module.js.map