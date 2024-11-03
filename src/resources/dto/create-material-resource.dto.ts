import { IsString, IsEnum, IsOptional, IsInt } from 'class-validator';
import { ResourceType, ResourceStatus } from '@prisma/client'; 

export class CreateMaterialResourceDto {
  @IsString()
  type: ResourceType; 

  @IsString()
  typeDescription: string; 

  @IsInt()
  quantity: number; 

  @IsEnum(ResourceStatus)
  status: ResourceStatus; 

  @IsString()
  location: string; 

  @IsString()
  responsiblePerson: string; 

  @IsOptional()
  expectedArrivalDate?: Date; 
}
