import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMaterialResourceDto } from './dto/create-material-resource.dto';
import { MaterialResource } from '@prisma/client';

@Injectable()
export class MaterialResourceService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkUserAccess(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { roleId: true },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.roleId !== 2 && user.roleId !== 1) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }
  }

  async create(createMaterialResourceDto: CreateMaterialResourceDto, userId: number): Promise<MaterialResource> {
    await this.checkUserAccess(userId);
    return this.prisma.materialResource.create({
      data: createMaterialResourceDto,
    });
  }

  async findAll(
    userId: number,
    status?: string,
    type?: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ items: MaterialResource[], totalPages: number }> {
    await this.checkUserAccess(userId);
    
    const filters: any = {};
    if (status) filters.status = status;
    if (type) filters.type = type;
  
    const items = await this.prisma.materialResource.findMany({
      where: filters,
      skip: (page - 1) * limit, 
      take: limit, 
    });
  
    const totalCount = await this.prisma.materialResource.count({
      where: filters,
    });
  
    const totalPages = Math.ceil(totalCount / limit);
  
    return {
      items,
      totalPages,
    };
  }
  
  async findOne(id: number, userId: number): Promise<MaterialResource | null> {
    await this.checkUserAccess(userId);
    return this.prisma.materialResource.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateData: Partial<CreateMaterialResourceDto>, userId: number): Promise<MaterialResource> {
    await this.checkUserAccess(userId);
    return this.prisma.materialResource.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number, userId: number): Promise<MaterialResource> {
    await this.checkUserAccess(userId);
    return this.prisma.materialResource.delete({
      where: { id },
    });
  }
}
