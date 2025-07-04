import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { ParkingSlot } from 'src/parking-slot/parking-slot.entity';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, ParkingSlot]), MailerModule],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
