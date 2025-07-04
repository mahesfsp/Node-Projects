import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSlot } from 'src/parking-slot/parking-slot.entity';
import { Booking } from 'src/booking/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSlot, Booking])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
