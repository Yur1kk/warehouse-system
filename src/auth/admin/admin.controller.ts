import { Controller, Post, Body, Request, UseGuards, BadRequestException, Delete, Param } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../strategies/jwt-auth.guard';
import { RegisterAdminDto } from './dto/admin-register.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('register-admin')
  async registerAdmin(@Body() registerAdminDto: RegisterAdminDto, @Request() req) {
    return this.adminService.registerAdmin(registerAdminDto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-admin/:adminId')
  async deleteAdmin(@Param('adminId') adminId: number, @Request() req) {
    const requestingUserId = req.user.sub;
    return this.adminService.deleteAdmin(requestingUserId, adminId);
  }
}
