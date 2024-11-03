import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from 'prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './auth/admin/admin.module';
import { MaterialResourceModule } from './resources/material-resource.module';

@Module({
  imports: [AuthModule, UserModule, AdminModule, MaterialResourceModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
