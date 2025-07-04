import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Borrow } from './borrow.entity';
import { Book } from 'src/books/book.entity';
import { BorrowBookDto } from './dto/borrow.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BorrowService {
  constructor(
    @InjectRepository(Borrow)
    private borrowRepo: Repository<Borrow>,

    @InjectRepository(Book)
    private bookRepo: Repository<Book>,
  ) {}

  async borrowBook(dto: BorrowBookDto, user: User): Promise<Borrow> {
    const book = await this.bookRepo.findOne({ where: { id: dto.bookId } });

    if (!book) {
      throw new NotFoundException('Book not found');
    }

    if (book.stock <= 0) {
      throw new BadRequestException('Book out of stock');
    }

    const currentBorrows = await this.borrowRepo.count({
      where: {
        user,
        returnDate: IsNull(),
      },
    });

    if (currentBorrows >= 5) {
      throw new BadRequestException('Borrow limit reached (max 5 books)');
    }

    const borrow = this.borrowRepo.create({
      book,
      user,
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      returnDate: null,
    });

    // Decrease book stock
    book.stock -= 1;
    await this.bookRepo.save(book);

    return this.borrowRepo.save(borrow);
  }

  async returnBook(borrowId: string, user: User): Promise<Borrow> {
    const borrow = await this.borrowRepo.findOne({
      where: {
        id: borrowId,
        user,
        returnDate: IsNull(),
      },
      relations: ['book'],
    });

    if (!borrow) {
      throw new NotFoundException('Active borrow record not found');
    }

    borrow.returnDate = new Date();

    // Increase book stock back
    borrow.book.stock += 1;
    await this.bookRepo.save(borrow.book);

    return this.borrowRepo.save(borrow);
  }

  async getMyBorrowedBooks(user: User): Promise<Borrow[]> {
    return this.borrowRepo.find({
      where: {
        user,
        returnDate: IsNull(),
      },
      relations: ['book'],
      order: {
        borrowDate: 'DESC',
      },
    });
  }

  async getBorrowHistory(user: User): Promise<Borrow[]> {
    return this.borrowRepo.find({
      where: { user },
      relations: ['book'],
      order: { borrowDate: 'DESC' },
    });
  }
}
