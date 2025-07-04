import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsNumber, Min } from 'class-validator';
import { User } from 'src/auth/user.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true })
  publishedYear: number;

  @ManyToOne(() => User, (user) => user.books, { eager: false })
  createdBy: User;

  @Column({ default: true })
isAvailable: boolean;


 @IsNumber()
  @Min(1)
  stock: number; // New field
}
