import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { Response } from 'express';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(@Req() req: Request) {
    // Initiates Google OAuth2 flow
    return { message: 'Google authentication initiated' };
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: Request, @Res() res: Response) {
    const { token, user } = await this.authService.handleOAuthLogin(req.user);
    
    // Redirect to frontend with token
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubLogin(@Req() req: Request) {
    // Initiates GitHub OAuth2 flow
    return { message: 'GitHub authentication initiated' };
  }

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubLoginCallback(@Req() req: Request, @Res() res: Response) {
    const { token, user } = await this.authService.handleOAuthLogin(req.user);
    
    // Redirect to frontend with token
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    // In a more complete implementation, you might want to blacklist the token
    // For now, just redirect to login page
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    return res.redirect(`${frontendUrl}/login`);
  }
}
