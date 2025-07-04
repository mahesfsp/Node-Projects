import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReminderService } from './reminder.service';
import { Borrow } from 'src/borrow/borrow.entity';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrow]), // ✅ gives ReminderService access to BorrowRepo
    MailerModule,                       // ✅ gives access to MailerService
  ],
  providers: [ReminderService],
  exports: [ReminderService], // ✅ export if needed elsewhere
})
export class ReminderModule {}
