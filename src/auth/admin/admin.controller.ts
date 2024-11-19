import { Controller, Post, Body, Request, UseGuards, ForbiddenException, Delete, Param, Get } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../strategies/jwt-auth.guard';
import { RegisterAdminDto } from './dto/admin-register.dto';
import { UserService } from 'src/user/user.service';

@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService, private userService: UserService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('register-admin')
  async registerAdmin(@Body() registerAdminDto: RegisterAdminDto, @Request() req) {
    return this.adminService.registerAdmin(registerAdminDto, req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-admin/:adminId')
  async deleteAdmin(@Param('adminId') adminId: string, @Request() req) {
    const requestingUserId = req.user.sub;
    const parsedId = parseInt(adminId, 10)
    return this.adminService.deleteAdmin(requestingUserId, parsedId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all-admins')
  async getAllAdmins(@Request() req) {
    const requestingUserId = req.user.sub;
    const requestingUser = await this.userService.findUserById(requestingUserId);

    if (!requestingUser || requestingUser.roleId !== 1) {
      throw new ForbiddenException('Only Head admin can view all admins!');
    }
    return this.adminService.getAllAdmins();
  }
}
