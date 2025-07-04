import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from 'src/auth/user.entity';
import { Book } from 'src/books/book.entity';

@Entity()
export class Borrow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Book, { eager: true })
  book: Book;

  @Column()
  borrowDate: Date;

  @Column()
  dueDate: Date;

@Column({ default: 0 })
stock: number;

  @Column({ type: 'timestamp', nullable: true })
returnDate: Date | null;
}
