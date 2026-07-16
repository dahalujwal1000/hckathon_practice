import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    email: string;
    name: string;
    avatarUrl?: string;
    role?: UserRole;
    password?: string;
}
