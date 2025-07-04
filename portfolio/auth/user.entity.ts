import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from './user-role.enum';
import { Task } from 'src/tasks/task.entity';
import { Booking } from 'src/booking/booking.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @OneToMany(() => Task, (task) => task.user, { eager: false })
  tasks: Task[];

  @OneToMany(() => Booking, (booking) => booking.user)
  bookings: Booking[];
}
