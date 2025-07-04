import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking } from 'src/booking/booking.entity';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class ReminderService {
  private readonly logger = new Logger(ReminderService.name);

  constructor(
    @InjectRepository(Booking)
    private bookingRepo: Repository<Booking>,
    private mailerService: MailerService,
  ) {}

  // 🕒 Every minute, check if any booking starts in exactly 5 minutes
  @Cron(CronExpression.EVERY_MINUTE)
  async handleBookingReminders() {
    const now = new Date();
    const twoMinutesLater = new Date(now.getTime() + 2 * 60 * 1000);
    const sixMinutesLater = new Date(twoMinutesLater.getTime() + 60 * 1000); // 1-minute window

    const reminders = await this.bookingRepo.find({
      where: {
        startTime: Between(twoMinutesLater, sixMinutesLater),
        isCancelled: false,
      },
      relations: ['user', 'slot'],
    });

    for (const booking of reminders) {
      const email = booking.user.email;
      const slot = booking.slot.slotNumber;
      const start = booking.startTime.toLocaleTimeString();

      await this.mailerService.sendMail(
        email,
        '⏰ Upcoming Parking Reminder',
        `Reminder: Your booking for Slot ${slot} starts at ${start}. Please arrive on time.`,
      );

      this.logger.log(`Reminder sent to ${email} for slot ${slot}`);
    }
  }
}
