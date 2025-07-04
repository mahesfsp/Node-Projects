import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { User } from 'src/auth/user.entity'; // ✅ import User entity

@Injectable()
export class BooksService {
  private logger = new Logger(BooksService.name);

  constructor(
    @InjectRepository(Book)
    private booksRepo: Repository<Book>,
  ) {}

async findAll(): Promise<Book[]> {
  try {
    return await this.booksRepo.find({ relations: ['createdBy'] });
  } catch (error) {
    this.logger.error('Failed to fetch books', error.stack);
    throw new Error('Failed to fetch books');
  }
}

  // ✅ Updated to accept user and set createdBy relation
  create(dto: CreateBookDto, user: User): Promise<Book> {
    const book = this.booksRepo.create({
      ...dto,
      createdBy: user,
    });

    this.logger.log(`Book created by ${user.username}: ${dto.title}`);
    return this.booksRepo.save(book);
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.booksRepo.findOneBy({ id });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: string, dto: UpdateBookDto): Promise<Book> {
    const book = await this.booksRepo.findOneBy({ id });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    Object.assign(book, dto);
    return this.booksRepo.save(book);
  }

  async remove(id: string): Promise<void> {
    await this.booksRepo.delete(id);
  }
}
