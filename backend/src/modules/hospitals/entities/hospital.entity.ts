import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

export enum HospitalType {
  GOVERNMENT = 'government',
  PRIVATE = 'private',
  NGO = 'ngo',
  COMMUNITY = 'community',
}

@Entity('hospitals')
export class Hospital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal', precision: 9, scale: 6 })
  longitude: number;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: 'enum', enum: HospitalType })
  type: HospitalType;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  rating?: number;

  @Column({ type: 'int', nullable: true })
  establishedYear?: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Doctor, doctor => doctor.hospital)
  doctors: Doctor[];

    @OneToMany(() => Ambulance, ambulance => ambulance.baseHospital)
    ambulances: Ambulance[];

  // Relationship to appointments
  @OneToMany(() => Appointment, appointment => appointment.hospital)
  appointments: Appointment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}