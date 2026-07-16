import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { QueryUserDto } from '../dto/query-user.dto';
import { User } from './entities/user.entity';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(queryDto: QueryUserDto): Promise<any>;
    getUserById(id: string, currentUser: User): Promise<any>;
    createUser(createDto: CreateUserDto): Promise<any>;
    updateUser(id: string, updateDto: UpdateUserDto, currentUser: User): Promise<any>;
    deleteUser(id: string): Promise<any>;
}
