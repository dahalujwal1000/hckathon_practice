import { AuthService } from './service/auth.service';
import { Response } from 'express';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private readonly authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    googleLogin(req: Request): Promise<{
        message: string;
    }>;
    googleLoginCallback(req: Request, res: Response): Promise<void>;
    githubLogin(req: Request): Promise<{
        message: string;
    }>;
    githubLoginCallback(req: Request, res: Response): Promise<void>;
    getProfile(req: Request): any;
    logout(req: Request, res: Response): Promise<void>;
}
