import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowController } from './borrow.controller';
import { BorrowService } from './borrow.service';
import { MailerModule } from 'src/mailer/mailer.module';

import { Borrow } from './borrow.entity';
import { Book } from 'src/books/book.entity';
import { User } from 'src/auth/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Borrow, Book, User]),
    MailerModule, // ✅ This makes MailerService available
  ],
  controllers: [BorrowController],
  providers: [BorrowService], // ✅ Both services registered
})
export class BorrowModule {}
