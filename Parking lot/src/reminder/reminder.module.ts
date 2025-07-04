import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderService } from './reminder.service';
import { Booking } from 'src/booking/booking.entity';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), MailerModule],
  providers: [ReminderService],
})
export class ReminderModule {}
