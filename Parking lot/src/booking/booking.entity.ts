import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/auth/user.entity';
import { ParkingSlot } from 'src/parking-slot/parking-slot.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.bookings, { eager: true })
  user: User;

  @ManyToOne(() => ParkingSlot, (slot) => slot.bookings, { eager: true })
  slot: ParkingSlot;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column({ default: false })
  isCancelled: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
