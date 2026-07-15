import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { User } from '../../users/entities/user.entity';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  specialization: string;

  @Column({ nullable: true })
  hospitalId?: string;

  @ManyToOne(() => Hospital, hospital => hospital.doctors)
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;

  @Column({ nullable: true })
  biography?: string;

  @Column({ type: 'int', nullable: true })
  experienceYears?: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
  consultationFee?: number;

  @Column('simple-array', { nullable: true })
  availableDays?: string[];

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}