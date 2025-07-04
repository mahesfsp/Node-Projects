import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/auth/user-role.enum';

@Controller('booking')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @Roles(UserRole.USER)
  book(@Body() dto: CreateBookingDto, @GetUser() user: User) {
    return this.bookingService.create(dto, user);
  }

  @Get('my')
  @Roles(UserRole.USER)
  getMyBookings(@GetUser() user: User) {
    return this.bookingService.findMyBookings(user);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  getAll() {
    return this.bookingService.findAll();
  }

  @Patch('cancel/:id')
  @Roles(UserRole.USER)
  cancelBooking(@Param('id') id: string, @GetUser() user: User) {
    return this.bookingService.cancel(id, user);
  }
}
