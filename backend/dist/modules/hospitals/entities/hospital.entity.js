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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hospital = exports.HospitalType = void 0;
const typeorm_1 = require("typeorm");
const doctor_entity_1 = require("../../doctors/entities/doctor.entity");
var HospitalType;
(function (HospitalType) {
    HospitalType["GOVERNMENT"] = "government";
    HospitalType["PRIVATE"] = "private";
    HospitalType["NGO"] = "ngo";
    HospitalType["COMMUNITY"] = "community";
})(HospitalType || (exports.HospitalType = HospitalType = {}));
let Hospital = class Hospital {
    id;
    name;
    address;
    latitude;
    longitude;
    phone;
    website;
    type;
    rating;
    establishedYear;
    isActive;
    doctors;
    ambulances;
    createdAt;
    updatedAt;
    deletedAt;
};
exports.Hospital = Hospital;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Hospital.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Hospital.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Hospital.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 9, scale: 6 }),
    __metadata("design:type", Number)
], Hospital.prototype, "latitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 9, scale: 6 }),
    __metadata("design:type", Number)
], Hospital.prototype, "longitude", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hospital.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Hospital.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: HospitalType }),
    __metadata("design:type", String)
], Hospital.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 3, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Hospital.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Hospital.prototype, "establishedYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Hospital.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => doctor_entity_1.Doctor, doctor => doctor.hospital),
    __metadata("design:type", Array)
], Hospital.prototype, "doctors", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Ambulance, ambulance => ambulance.baseHospital),
    __metadata("design:type", Array)
], Hospital.prototype, "ambulances", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Hospital.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Hospital.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], Hospital.prototype, "deletedAt", void 0);
exports.Hospital = Hospital = __decorate([
    (0, typeorm_1.Entity)('hospitals')
], Hospital);
//# sourceMappingURL=hospital.entity.js.map