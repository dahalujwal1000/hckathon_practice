import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { UsersRepository } from './repository/users.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUsers(queryDto: QueryUserDto): Promise<[User[], number]> {
    return this.usersRepository.findAndPaginate(queryDto);
  }

  async getUserById(id: string, currentUser: User): Promise<User> {
    // Check if the current user is allowed to view this user
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      throw new ForbiddenException('You do not have permission to view this user');
    }
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async createUser(createDto: CreateUserDto): Promise<User> {
    // Check if user with this email already exists
    const existingUser = await this.usersRepository.findByEmail(createDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    return this.usersRepository.createUser(createDto);
  }

  async updateUser(
    id: string,
    updateDto: UpdateUserDto,
    currentUser: User,
  ): Promise<User> {
    // Check if the current user is allowed to update this user
    if (currentUser.role !== 'admin' && currentUser.id !== id) {
      throw new ForbiddenException('You do not have permission to update this user');
    }
    const exists = await this.usersRepository.findById(id);
    if (!exists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.usersRepository.updateUser(id, updateDto);
  }

  async deleteUser(id: string): Promise<void> {
    const exists = await this.usersRepository.findById(id);
    if (!exists) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.usersRepository.softDelete(id);
  }
}