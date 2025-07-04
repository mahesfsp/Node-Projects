import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { UserLoginDetail } from './user-login-detail.entity';

@Entity('audit_user_login')
export class AuditUserLogin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserLoginDetail)
  @JoinColumn({ name: 'id_user_login_detail' })
  userLoginDetail: UserLoginDetail;

  @Column()
  session_id: string;

  @Column()
  login_status: string; // SUCCESS or FAILED

  @CreateDateColumn()
  login_date_time: Date;

  @Column({ nullable: true })
  logout_date_time: Date;
}
