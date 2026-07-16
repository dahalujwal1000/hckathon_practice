import { UserRole } from '../entities/user.entity';
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    avatarUrl?: string;
    role?: UserRole;
    password?: string;
}
