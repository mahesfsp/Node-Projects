import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSlotController } from './parking-slot.controller';
import { ParkingSlotService } from './parking-slot.service';
import { ParkingSlot } from './parking-slot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSlot])],
  controllers: [ParkingSlotController],
  providers: [ParkingSlotService],
})
export class ParkingSlotModule {}
