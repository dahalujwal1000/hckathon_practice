import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Hospital } from '../../hospitals/entities/hospital.entity';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.appointments as any)
  @JoinColumn({ name: 'patientId' })
  patient: User;

  @Column({ name: 'patientId' })
  patientId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments as any)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  @Column({ name: 'doctorId' })
  doctorId: string;

  @ManyToOne(() => Hospital, (hospital) => hospital.appointments as any)
  @JoinColumn({ name: 'hospitalId' })
  hospital: Hospital;

  @Column({ name: 'hospitalId' })
  hospitalId: string;

  @Column()
  appointmentDateTime: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({ nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  // Exclude sensitive fields when transforming to JSON (e.g., for responses)
  @Exclude()
  // We don't have sensitive fields in appointment, but if we did, we'd mark them here.
}