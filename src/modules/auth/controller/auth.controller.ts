import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google/login')
  @UseGuards(JwtAuthGuard)
  async googleLogin(@Req() req: Request) {
    return req.user;
  }

  @Get('google/callback')
  async googleLoginCallback(@Req() req: Request, @Res() res: Response) {
    const { token, user } = await this.authService.handleOAuthLogin(req.user);
    return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }

  @Get('github/login')
  @UseGuards(JwtAuthGuard)
  async githubLogin(@Req() req: Request) {
    return req.user;
  }

  @Get('github/callback')
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const { token, user } = await this.authService.handleOAuthLogin(req.user);
    return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    return req.user;
  }

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    req.session.destroy();
    return res.sendStatus(200);
  }
}