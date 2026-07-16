import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { QueryUserDto } from './dto/query-user.dto';
export declare class UsersRepository {
    private readonly repository;
    constructor(repository: Repository<User>);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAndPaginate(queryDto: QueryUserDto): Promise<[User[], number]>;
    createUser(data: Partial<User>): Promise<User>;
    updateUser(id: string, data: Partial<User>): Promise<User>;
    softDelete(id: string): Promise<void>;
}
