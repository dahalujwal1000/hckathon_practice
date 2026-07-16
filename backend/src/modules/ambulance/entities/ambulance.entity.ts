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
import { Exclude, Expose } from 'class-transformer';
import { Hospital } from '../../hospitals/entities/hospital.entity';

export enum AmbulanceType {
  GROUND = 'ground',
  AIR = 'air',
}

export enum AmbulanceStatus {
  AVAILABLE = 'available',
  ON_CALL = 'on_call',
  MAINTENANCE = 'maintenance',
}

@Entity('ambulances')
export class Ambulance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  licensePlate: string;

  @Column({ type: 'enum', enum: AmbulanceType })
  type: AmbulanceType;

  @ManyToOne(() => Hospital, hospital => hospital.ambulances)
  @JoinColumn({ name: 'hospital_id' })
  baseHospital: Hospital;

  @Column({ type: 'enum', enum: AmbulanceStatus })
  status: AmbulanceStatus;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lastLatitude?: number;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  lastLongitude?: number;

  @Column({ type: 'timestamp', nullable: true })
  lastLocationUpdate?: Date;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}