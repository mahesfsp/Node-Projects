import { ApiProperty ,ApiPropertyOptional} from '@nestjs/swagger';
import { IsString, IsNumber,IsOptional } from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'The Pragmatic Programmer' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Andrew Hunt' })
  @IsString()
  author: string;

  @ApiProperty({ example: 10, description: 'Initial stock count' })
  @IsNumber()
  stock: number;

   @ApiPropertyOptional({ example: 1999, description: 'Year the book was published' })
  @IsOptional()
  @IsNumber()
  publishedYear?: number;
}
