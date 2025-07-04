import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Booking } from './booking.entity';
import { User } from 'src/auth/user.entity';
import { ParkingSlot } from 'src/parking-slot/parking-slot.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { MailerService } from 'src/mailer/mailer.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(ParkingSlot) private slotRepo: Repository<ParkingSlot>,
    private mailerService: MailerService,
  ) {}

  async create(dto: CreateBookingDto, user: User) {
    const slot = await this.slotRepo.findOne({ where: { id: dto.slotId } });
    if (!slot) throw new NotFoundException('Parking slot not found');

    // Convert input strings to Date objects
    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    if (startTime >= endTime) {
      throw new ConflictException('Start time must be before end time');
    }

    // Check for time overlaps
    const overlaps = await this.bookingRepo.findOne({
      where: {
        slot: { id: dto.slotId },
        isCancelled: false,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
      relations: ['slot'],
    });

    if (overlaps) {
      throw new ConflictException(
        'Slot is already booked for the selected time range',
      );
    }

    const booking = this.bookingRepo.create({
      slot,
      user,
      startTime,
      endTime,
    });
    await this.mailerService.sendMail(
      'mahesinfotech2012@gmail.com',
      'Booking Confirmed',
      `Your slot ${slot.slotNumber} has been booked successfully!`,
    );
    return this.bookingRepo.save(booking);
  }

  findMyBookings(user: User) {
    return this.bookingRepo.find({
      where: { user },
      relations: ['slot'],
      order: { startTime: 'ASC' },
    });
  }

  findAll() {
    return this.bookingRepo.find({
      relations: ['slot', 'user'],
      order: { startTime: 'ASC' },
    });
  }

  async cancel(id: string, user: User) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['slot', 'user'],
    });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.user.id !== user.id) {
      throw new ForbiddenException("You can't cancel others' bookings");
    }

    booking.isCancelled = true;
    return this.bookingRepo.save(booking);
  }
}
