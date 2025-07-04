import { IsUUID } from 'class-validator';

export class BorrowBookDto {
  @IsUUID()
  bookId: string;
}
