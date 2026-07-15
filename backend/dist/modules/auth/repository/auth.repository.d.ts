import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
export declare class AuthRepository {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    findByEmail(email: string): Promise<User | null>;
    findByProviderAndProviderId(provider: string, providerId: string): Promise<User | null>;
    create(userData: Partial<User>): Promise<User>;
    updateLastLogin(userId: string): Promise<User>;
}
