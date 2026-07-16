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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./repository/users.repository");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async getUsers(queryDto) {
        return this.usersRepository.findAndPaginate(queryDto);
    }
    async getUserById(id, currentUser) {
        if (currentUser.role !== 'admin' && currentUser.id !== id) {
            throw new common_1.ForbiddenException('You do not have permission to view this user');
        }
        const user = await this.usersRepository.findById(id);
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async createUser(createDto) {
        const existingUser = await this.usersRepository.findByEmail(createDto.email);
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        return this.usersRepository.createUser(createDto);
    }
    async updateUser(id, updateDto, currentUser) {
        if (currentUser.role !== 'admin' && currentUser.id !== id) {
            throw new common_1.ForbiddenException('You do not have permission to update this user');
        }
        const exists = await this.usersRepository.findById(id);
        if (!exists) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return this.usersRepository.updateUser(id, updateDto);
    }
    async deleteUser(id) {
        const exists = await this.usersRepository.findById(id);
        if (!exists) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        await this.usersRepository.softDelete(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_repository_1.UsersRepository !== "undefined" && users_repository_1.UsersRepository) === "function" ? _a : Object])
], UsersService);
//# sourceMappingURL=users.service.js.map