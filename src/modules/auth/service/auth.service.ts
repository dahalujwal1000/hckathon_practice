import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repository/auth.repository';
import { OAuthProfile } from './dto/oauth-user.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async handleOAuthLogin(profile: OAuthProfile): Promise<{ token: string; user: User }> {
    let user = await this.authRepository.findByProviderAndProviderId(
      profile.provider,
      profile.providerId,
    );

    if (!user) {
      // Check if user exists with email (for account linking)
      user = await this.authRepository.findByEmail(profile.email);

      if (user) {
        // Link existing account with OAuth provider
        user.provider = profile.provider;
        user.providerId = profile.providerId;
        if (profile.avatarUrl) user.avatarUrl = profile.avatarUrl;
        user = await this.authRepository.create(user);
      } else {
        // Create new user
        user = await this.authRepository.create({
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.avatarUrl,
          provider: profile.provider,
          providerId: profile.providerId,
          role: 'patient', // Default role
        });
      }
    } else {
      // Update last login
      user = await this.authRepository.updateLastLogin(user.id);
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token, user };
  }

  validateUser(payload: any) {
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}