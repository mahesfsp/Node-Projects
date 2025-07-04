import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateParkingSlotDto {
  @IsString()
  slotNumber: string;

  @IsOptional()
  @IsIn(['available', 'occupied'])
  status?: 'available' | 'occupied';

  @IsOptional()
  @IsString()
  level?: string;
}
