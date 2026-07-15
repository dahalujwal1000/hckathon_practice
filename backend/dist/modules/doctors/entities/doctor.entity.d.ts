import { User } from '../../users/entities/user.entity';
export declare class Doctor {
    id: string;
    user: User;
    specialization: string;
    hospitalId?: string;
    hospital: Hospital;
    biography?: string;
    experienceYears?: number;
    consultationFee?: number;
    availableDays?: string[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}
