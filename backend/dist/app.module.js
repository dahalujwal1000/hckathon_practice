"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const doctors_module_1 = require("./modules/doctors/doctors.module");
const hospitals_module_1 = require("./modules/hospitals/hospitals.module");
const ambulance_module_1 = require("./modules/ambulance/ambulance.module");
const shared_module_1 = require("./shared/shared.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.local'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST') || 'localhost',
                    port: configService.get('DB_PORT') || 5432,
                    username: configService.get('DB_USERNAME') || 'postgres',
                    password: configService.get('DB_PASSWORD') || 'postgres',
                    database: configService.get('DB_NAME') || 'nepal_health',
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
                    synchronize: false,
                    logging: process.env.NODE_ENV === 'development',
                }),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            doctors_module_1.DoctorsModule,
            hospitals_module_1.HospitalsModule,
            ambulance_module_1.AmbulanceModule,
            shared_module_1.SharedModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map