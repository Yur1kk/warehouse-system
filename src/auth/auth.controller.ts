import { Controller, Post, Body, UseGuards, Req, Get, Query, BadRequestException, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './strategies/jwt-auth.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Request } from 'express';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private jwtService: JwtService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('request-password-reset')
  async requestPasswordReset(@Req() request: Request & { user: User }) {
    const email = request.user.email; 
    return this.authService.requestPasswordReset(email);
  }

  @Get('reset-password')
  async getResetPasswordPage(
    @Query('token') token: string,
    @Query('email') email: string,
    @Res() res: Response
  ) {
    if (!token || !email) {
      throw new BadRequestException('Token or email is missing.');
    }

    const isValidToken = await this.authService.validateResetToken(token, email);
    if (!isValidToken) {
      return res.status(400).send('Invalid or expired token.');
    }

    const clientUrl = `http://localhost:4000/reset-password?token=${token}&email=${email}`;
    return res.redirect(clientUrl);
  }
  
  
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { newPassword, token, email } = body; 
  
    if (!token || !email) {
      throw new BadRequestException('Token or email is missing.');
    }
  
    
    await this.authService.resetPassword(newPassword, token);
  
    return { message: 'Password has been reset successfully.' };
  }
  
}
