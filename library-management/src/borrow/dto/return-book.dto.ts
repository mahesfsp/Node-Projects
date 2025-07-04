import { IsUUID } from 'class-validator';

export class ReturnBookDto {
  @IsUUID()
  borrowId: string;
}
