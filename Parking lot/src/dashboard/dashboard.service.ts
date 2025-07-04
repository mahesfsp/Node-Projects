import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ParkingSlot } from 'src/parking-slot/parking-slot.entity';
import { Booking } from 'src/booking/booking.entity';
import { UserRole } from 'src/auth/user-role.enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ParkingSlot)
    private readonly slotRepo: Repository<ParkingSlot>,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
  ) {}

  async getSummary(date?: string, role?: string, page = 1, limit = 10) {
    const totalSlots = await this.slotRepo.count();
    const availableNow = await this.slotRepo.count({
      where: { isAvailable: true },
    });
    const bookedNow = totalSlots - availableNow;

    const selectedDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    const bookingFilter: any = {
      startTime: Between(startOfDay, endOfDay),
      isCancelled: false,
    };

    if (
      role &&
      Object.values(UserRole).includes(role.toUpperCase() as UserRole)
    ) {
      bookingFilter.user = { role: role.toUpperCase() };
    }

    const [bookings, totalBookings] = await this.bookingRepo.findAndCount({
      where: bookingFilter,
      relations: ['user', 'slot'],
      skip: (page - 1) * limit,
      take: limit,
      order: { startTime: 'ASC' },
    });

    return {
      summary: {
        totalSlots,
        bookedNow,
        availableNow,
        todayBookings: totalBookings,
      },
      pagination: {
        currentPage: page,
        limit,
        totalBookings,
        totalPages: Math.ceil(totalBookings / limit),
      },
      bookings,
    };
  }
}
