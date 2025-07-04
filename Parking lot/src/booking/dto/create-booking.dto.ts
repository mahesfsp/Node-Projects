import { IsUUID, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  slotId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
