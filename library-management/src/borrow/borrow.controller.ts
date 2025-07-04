import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BorrowService } from './borrow.service';
import { BorrowBookDto } from './dto/borrow.dto';
import { ReturnBookDto } from './dto/return-book.dto';

@Controller('borrow')
@UseGuards(AuthGuard('jwt'))
export class BorrowController {
    constructor(private borrowService: BorrowService) { }

    @Post()
    borrow(@Body() dto: BorrowBookDto, @Request() req) {
        return this.borrowService.borrowBook(dto, req.user);
    }

    @Post('return')
    @UseGuards(AuthGuard('jwt'))
    returnBook(@Body() dto: ReturnBookDto, @Request() req) {
        return this.borrowService.returnBook(dto.borrowId, req.user);
    }

    @Get('my-borrowed')
    @UseGuards(AuthGuard('jwt'))
    getMyBorrowedBooks(@Request() req) {
        return this.borrowService.getMyBorrowedBooks(req.user);
    }

    @Get('history')
    @UseGuards(AuthGuard('jwt'))
    getBorrowHistory(@Request() req) {
        return this.borrowService.getBorrowHistory(req.user);
    }
}
