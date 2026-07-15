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
exports.Ambulance = exports.AmbulanceStatus = exports.AmbulanceType = void 0;
const typeorm_1 = require("typeorm");
const hospital_entity_1 = require("../hospitals/entities/hospital.entity");
var AmbulanceType;
(function (AmbulanceType) {
    AmbulanceType["GROUND"] = "ground";
    AmbulanceType["AIR"] = "air";
})(AmbulanceType || (exports.AmbulanceType = AmbulanceType = {}));
var AmbulanceStatus;
(function (AmbulanceStatus) {
    AmbulanceStatus["AVAILABLE"] = "available";
    AmbulanceStatus["ON_CALL"] = "on_call";
    AmbulanceStatus["MAINTENANCE"] = "maintenance";
})(AmbulanceStatus || (exports.AmbulanceStatus = AmbulanceStatus = {}));
let Ambulance = class Ambulance {
    id;
    licensePlate;
    type;
    baseHospital;
    status;
    lastLatitude;
    lastLongitude;
    lastLocationUpdate;
    isActive;
    createdAt;
    updatedAt;
    deletedAt;
};
exports.Ambulance = Ambulance;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Ambulance.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ambulance.prototype, "licensePlate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AmbulanceType }),
    __metadata("design:type", String)
], Ambulance.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => hospital_entity_1.Hospital, hospital => hospital.ambulances),
    (0, typeorm_1.JoinColumn)({ name: 'hospital_id' }),
    __metadata("design:type", typeof (_a = typeof hospital_entity_1.Hospital !== "undefined" && hospital_entity_1.Hospital) === "function" ? _a : Object)
], Ambulance.prototype, "baseHospital", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AmbulanceStatus }),
    __metadata("design:type", String)
], Ambulance.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 9, scale: 6, nullable: true }),
    __metadata("design:type", Number)
], Ambulance.prototype, "lastLatitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 9, scale: 6, nullable: true }),
    __metadata("design:type", Number)
], Ambulance.prototype, "lastLongitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Ambulance.prototype, "lastLocationUpdate", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Ambulance.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Ambulance.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Ambulance.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Ambulance.prototype, "deletedAt", void 0);
exports.Ambulance = Ambulance = __decorate([
    (0, typeorm_1.Entity)('ambulances')
], Ambulance);
//# sourceMappingURL=ambulance.entity.js.map