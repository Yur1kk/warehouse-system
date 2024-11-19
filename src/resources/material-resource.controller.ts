import { Controller, Post, UseGuards, Body, Get, Param, Patch, Delete, Request, ParseIntPipe, Query } from '@nestjs/common';
import { MaterialResourceService } from './material-resource.service';
import { CreateMaterialResourceDto } from './dto/create-material-resource.dto';
import { MaterialResource } from '@prisma/client';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

@Controller('material-resources')
export class MaterialResourceController {
  constructor(private readonly materialResourceService: MaterialResourceService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Request() req,
    @Query('status') status: string,
    @Query('type') type: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
  ): Promise<{ items: MaterialResource[]; totalPages: number }> {
    const userId = req.user.sub;
    return this.materialResourceService.findAll(userId, status, type, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MaterialResource | null> {
    const userId = req.user.sub;
    return this.materialResourceService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Request() req,
    @Body() createMaterialResourceDto: CreateMaterialResourceDto,
  ): Promise<MaterialResource> {
    const userId = req.user.sub;
    return this.materialResourceService.create(createMaterialResourceDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateMaterialResourceDto>,
  ): Promise<MaterialResource> {
    const userId = req.user.sub;
    return this.materialResourceService.update(id, updateData, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MaterialResource> {
    const userId = req.user.sub;
    return this.materialResourceService.remove(id, userId);
  }
}
