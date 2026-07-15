import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { QueryUserDto } from './dto/query-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findAndPaginate(queryDto: QueryUserDto): Promise<[User[], number]> {
    const { page = 1, limit = 10, name, email, role } = queryDto;

    const qb = this.repository.createQueryBuilder('user');

    if (name) {
      qb.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }
    if (email) {
      qb.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }
    if (role) {
      qb.andWhere('user.role = :role', { role });
    }

    const [data, total] = await qb
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return [data, total];
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.repository.create(data);
    return this.repository.save(user);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    await this.repository.update(id, data);
    const updated = await this.repository.findOne({ where: { id } });
    if (!updated) {
      throw new Error('User not found after update');
    }
    return updated;
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete({ id });
  }
}