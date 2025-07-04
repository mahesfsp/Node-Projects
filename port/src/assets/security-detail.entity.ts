import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('security_detail')
export class SecurityDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  security_name: string;

  @Column()
  value: number;
}
