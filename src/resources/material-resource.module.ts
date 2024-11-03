import { Module } from '@nestjs/common';
import { MaterialResourceController } from './material-resource.controller';
import { MaterialResourceService } from './material-resource.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  })],
  controllers: [MaterialResourceController],
  providers: [MaterialResourceService, PrismaService],
})
export class MaterialResourceModule {}