import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_login_detail')
export class UserLoginDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.logins)
  @JoinColumn({ name: 'id_user_detail' })
  user: User;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email_address: string;

  @Column()
  user_status: string;

  @CreateDateColumn()
  created_on: Date;

  @Column()
  created_by: string;

  @UpdateDateColumn()
  modified_on: Date;

  @Column()
  modified_by: string;
}
