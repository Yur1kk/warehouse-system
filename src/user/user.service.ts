import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ProfilePhotoDto } from './dto/profile-photo.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findUserById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updatePassword(email: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { email },
      data: { password: hashedPassword, resetToken: null }, 
    });
  }

  async saveResetToken(userId: number, resetToken: string, expirationTime: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        resetToken,
        resetTokenExpiration: new Date(expirationTime), 
      },
    });
}

  async findUserByResetToken(token: string) {
    const users = await this.prisma.user.findMany(); 
    return users.find(user => user.resetToken === token); 
  }
  

  async clearResetToken(userId: number) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { resetToken: null, resetTokenExpiration: null },
    });
  }

  async addUserPhoto(userId: number, profilePhotoDto: ProfilePhotoDto) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const profilePhoto = user.profilePhoto
    if (profilePhoto) {
      throw new BadRequestException('Profile photo exists already');
    }
    await this.prisma.user.update({
      where: {id: userId},
      data: {
        profilePhoto: profilePhotoDto.profilePhoto,
      },
    });
    return {message: 'Profile photo has been added succesfully!'};
  }
  async deleteUserPhoto(userId: number) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.profilePhoto) {
      throw new NotFoundException('User does not have a profile photo');
  }

   await this.prisma.user.update({
    where: {id: userId},
    data: {profilePhoto: null},
   });
   return {message: 'Profile photo has been deleted succesfully!'};
  }

  async updateUserPhoto(userId: number, profilePhotoDto: ProfilePhotoDto) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.profilePhoto) {
      throw new NotFoundException('User does not have a profile photo');
  }
   const profilePhoto = user.profilePhoto;
   await this.prisma.user.update({
    where: {id: userId},
    data: {profilePhoto: profilePhotoDto.profilePhoto ?? profilePhoto},
   });
   return {message: 'Profile photo has been updated succesfully!'};
  }
}
