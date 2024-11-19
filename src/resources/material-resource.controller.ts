import { Controller, Post, UseGuards, Body, Get, Param, Patch, Delete, Query, Request, ParseIntPipe } from '@nestjs/common';
import { MaterialResourceService } from './material-resource.service';
import { CreateMaterialResourceDto } from './dto/create-material-resource.dto';
import { MaterialResource, ResourceStatus, ResourceType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/strategies/jwt-auth.guard';

@Controller('material-resources')
export class MaterialResourceController {
  constructor(private readonly materialResourceService: MaterialResourceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createMaterialResourceDto: CreateMaterialResourceDto): Promise<MaterialResource> {
    const userId = req.user.sub; 
    return this.materialResourceService.create(createMaterialResourceDto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter')
  filter(@Request() req, @Query('status') status: string, @Query('type') type: string): Promise<MaterialResource[]> {
    const userId = req.user.sub; 
    return this.materialResourceService.filterResources(userId, status as ResourceStatus, type as ResourceType);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Request() req): Promise<MaterialResource[]> {
    const userId = req.user.sub; 
    return this.materialResourceService.findAll(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(
    @Request() req,
    @Param('id', new ParseIntPipe()) id: number 
  ): Promise<MaterialResource | null> {
    const userId = req.user.sub;
    return this.materialResourceService.findOne(id, userId);
  }
  

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateData: Partial<CreateMaterialResourceDto>): Promise<MaterialResource> {
    const userId = req.user.sub; 
    return this.materialResourceService.update(Number(id), updateData, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string): Promise<MaterialResource> {
    const userId = req.user.sub; 
    return this.materialResourceService.remove(Number(id), userId);
  }
}