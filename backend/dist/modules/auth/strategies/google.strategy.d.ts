import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
declare const GoogleStrategy_base: new (...args: any) => any;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any, info?: any) => void): Promise<void>;
}
export {};
