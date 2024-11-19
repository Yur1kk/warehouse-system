import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import { PrismaService } from 'prisma/prisma.service';

dotenv.config();

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService, private mailService: MailService, private prismaService: PrismaService) {}

  async login(loginDto: LoginDto) {
    const user = await this.userService.findUserByEmail(loginDto.email);
    if (!user) {
      throw new NotFoundException('E-mail does not exist!');
    }

    const isPasswordMatching = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordMatching) {
      throw new BadRequestException('Passwords do not match!');
    }
    const payload = { email: user.email, sub: user.id, roleId: user.roleId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userService.findUserByEmail(email);
  
    if (!user) {
      throw new BadRequestException('User not found.');
    }
  
    const resetToken = uuidv4(); 
    const resetTokenExpires = new Date(Date.now() + 3600000); 
  
    await this.prismaService.user.update({
      where: { email },
      data: {
        resetToken: resetToken,
        resetTokenExpiration: resetTokenExpires,
      },
    });
  
    const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}&email=${email}`;
    const subject = 'Password Reset Request';
    const text = `You requested a password reset. Use the following link to reset your password: ${resetLink}`;
  

    await this.mailService.sendEmail(email, subject, text);
  }
  
  


async validateResetToken(token: string, email: string): Promise<boolean> {
  const user = await this.userService.findUserByEmail(email)

  if (!user || user.resetToken !== token || user.resetTokenExpiration < new Date()) {
    return false;
  }

  return true; 
}


async resetPassword(newPassword: string, token: string): Promise<void> {
  const user = await this.prismaService.user.findFirst({
    where: { resetToken: token },
  });

  if (!user) {
    throw new BadRequestException('Invalid token.');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await this.prismaService.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null, 
      resetTokenExpiration: null, 
    },
  });
}
}
