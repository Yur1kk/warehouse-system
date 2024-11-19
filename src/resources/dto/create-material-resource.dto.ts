import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateMaterialResourceDto {
  @IsString()
  type: string; 

  @IsString()
  typeDescription: string; 

  @IsInt()
  quantity: number; 

  @IsString()
  status: string; 

  @IsString()
  location: string; 

  @IsString()
  responsiblePerson: string; 

  @IsOptional()
  expectedArrivalDate?: Date; 
}
