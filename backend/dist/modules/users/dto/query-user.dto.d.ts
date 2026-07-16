import { UserRole } from '../entities/user.entity';
export declare class QueryUserDto {
    name?: string;
    email?: string;
    role?: UserRole;
    page?: number;
    limit?: number;
}
