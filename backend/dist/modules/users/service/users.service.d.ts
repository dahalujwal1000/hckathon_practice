import { UsersRepository } from './repository/users.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    getUsers(queryDto: QueryUserDto): Promise<[User[], number]>;
    getUserById(id: string, currentUser: User): Promise<User>;
    createUser(createDto: CreateUserDto): Promise<User>;
    updateUser(id: string, updateDto: UpdateUserDto, currentUser: User): Promise<User>;
    deleteUser(id: string): Promise<void>;
}
