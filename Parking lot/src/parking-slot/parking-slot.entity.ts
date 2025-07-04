import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from 'src/booking/booking.entity';

@Entity()
export class ParkingSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slotNumber: string;

  @Column({ default: 'available' })
  status: 'available' | 'occupied';

  @Column({ nullable: true })
  level: string;

  @Column({ default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Booking, (booking) => booking.slot)
  bookings: Booking[];
}
