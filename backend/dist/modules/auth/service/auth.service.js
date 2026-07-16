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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const auth_repository_1 = require("./repository/auth.repository");
let AuthService = class AuthService {
    constructor(authRepository, jwtService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
    }
    async handleOAuthLogin(profile) {
        let user = await this.authRepository.findByProviderAndProviderId(profile.provider, profile.providerId);
        if (!user) {
            user = await this.authRepository.findByEmail(profile.email);
            if (user) {
                user.provider = profile.provider;
                user.providerId = profile.providerId;
                if (profile.avatarUrl)
                    user.avatarUrl = profile.avatarUrl;
                user = await this.authRepository.create(user);
            }
            else {
                user = await this.authRepository.create({
                    email: profile.email,
                    name: profile.name,
                    avatarUrl: profile.avatarUrl,
                    provider: profile.provider,
                    providerId: profile.providerId,
                    role: 'patient',
                });
            }
        }
        else {
            user = await this.authRepository.updateLastLogin(user.id);
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is deactivated');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);
        return { token, user };
    }
    validateUser(payload) {
        return { userId: payload.sub, email: payload.email, role: payload.role };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_repository_1.AuthRepository !== "undefined" && auth_repository_1.AuthRepository) === "function" ? _a : Object, jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map