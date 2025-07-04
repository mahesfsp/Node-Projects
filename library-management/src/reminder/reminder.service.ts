import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between,IsNull } from 'typeorm';
import { Borrow } from 'src/borrow/borrow.entity';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Borrow)
    private borrowRepo: Repository<Borrow>,
    private mailerService: MailerService,
  ) {}

  @Cron('0 9 * * *') // Every day at 9:00 AM server time
  async sendDueDateReminders() {
    const today = new Date();
    const twoDaysLater = new Date();
    twoDaysLater.setDate(today.getDate() + 2);

const dueSoon = await this.borrowRepo.find({
  where: {
    dueDate: Between(today, twoDaysLater),
    returnDate: IsNull(),  // ✅ fix here
  },
  relations: ['user', 'book'],
});

    for (const record of dueSoon) {
      const emailText = `
Hi ${record.user.username},

Just a reminder that your borrowed book "${record.book.title}" is due on ${record.dueDate.toDateString()}.

Please return it on time to avoid penalties.

– Library System`;

      await this.mailerService.sendMail(
        record.user.email,
        'Book Due Reminder – Library',
        emailText,
      );
    }

    console.log(`[Reminder Job] Sent ${dueSoon.length} due reminders.`);
  }
}
