import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterAdminDto } from './dto/admin-register.dto';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { UserService } from 'src/user/user.service';

dotenv.config();

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService
  ) {}

  async registerAdmin(registerAdminDto: RegisterAdminDto, userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user || user.roleId !== 1) {
      throw new BadRequestException('Only Head admin can create new admin users');
    }
  
    if (registerAdminDto.adminPassword !== process.env.ADMIN_PASSWORD) {
      throw new BadRequestException('Invalid admin password');
    }
  
    const newAdmin = await this.createAdmin(registerAdminDto);
    
    const token = this.jwtService.sign({ sub: newAdmin.id, roleId: newAdmin.roleId });
  
    return { newAdmin, token }; 
  }
  

  async createAdmin(data: RegisterAdminDto) {
    const { confirmPassword, adminPassword, ...userData } = data; 
  
    if (data.password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.prisma.user.findUnique({
        where: { email: userData.email },
      });
    
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
  
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });
  }  

  async deleteAdmin(requestingUserId: number, adminId: number) {
    const requestingUser = await this.userService.findUserById(requestingUserId);

    if (!requestingUser ||requestingUser.roleId !== 1) {
      throw new ForbiddenException('Only Head admin can delete admins!');
    }
    const adminToDelete = await this.userService.findUserById(adminId);

    if (!adminToDelete) {
      throw new NotFoundException('Admin not found');
    }

    await this.prisma.user.delete({
      where: {id: adminId},
    });

    return {message: 'Admin has been deleted succesfully!'};
  }
}
