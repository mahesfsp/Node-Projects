// src/auth/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserLoginDetail } from './user-login-detail.entity';
import { UserRole } from './user-role.enum';

@Entity('user_detail')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email_address: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_on: Date;

  @Column()
  created_by: string;

  @UpdateDateColumn()
  modified_on: Date;

  @Column()
  modified_by: string;

  @OneToMany(() => UserLoginDetail, (login) => login.user)
  logins: UserLoginDetail[];

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;
}
