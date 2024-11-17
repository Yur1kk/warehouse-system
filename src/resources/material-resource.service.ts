import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMaterialResourceDto } from './dto/create-material-resource.dto';
import { MaterialResource, ResourceStatus, ResourceType } from '@prisma/client';

@Injectable()
export class MaterialResourceService {
  constructor(private readonly prisma: PrismaService) {}
  

  private checkUserAccess(roleId: number): void {
    if (roleId !== 2 && roleId !== 1) {
      throw new ForbiddenException('You do not have permission to perform this action');
    }
  }
  
  

  async create(createMaterialResourceDto: CreateMaterialResourceDto, userId: number): Promise<MaterialResource> {
    this.checkUserAccess(userId);
    return this.prisma.materialResource.create({
      data: createMaterialResourceDto,
    });
  }

  async findAll(userId: number): Promise<MaterialResource[]> {
    this.checkUserAccess(userId);
    return this.prisma.materialResource.findMany();
  }

  async findOne(id: number, userId: number): Promise<MaterialResource | null> {
    this.checkUserAccess(userId);
    return this.prisma.materialResource.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateData: Partial<CreateMaterialResourceDto>, userId: number): Promise<MaterialResource> {
    this.checkUserAccess(userId);
    return this.prisma.materialResource.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number, userId: number): Promise<MaterialResource> {
    this.checkUserAccess(userId);
    return this.prisma.materialResource.delete({
      where: { id },
    });
  }

  async filterResources(userId: number, status?: ResourceStatus, type?: ResourceType): Promise<MaterialResource[]> {
    this.checkUserAccess(userId);
    return this.prisma.materialResource.findMany({
      where: {
        ...(status && { status }),
        ...(type && { type }),
      },
    });
  }
}