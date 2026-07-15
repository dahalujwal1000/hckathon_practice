import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repository/auth.repository';
import { OAuthProfile } from './dto/oauth-user.dto';
import { User } from '../users/entities/user.entity';
export declare class AuthService {
    private readonly authRepository;
    private readonly jwtService;
    constructor(authRepository: AuthRepository, jwtService: JwtService);
    handleOAuthLogin(profile: OAuthProfile): Promise<{
        token: string;
        user: User;
    }>;
    validateUser(payload: any): {
        userId: any;
        email: any;
        role: any;
    };
}
