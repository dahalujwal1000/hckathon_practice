import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OAuthProfile } from './dto/oauth-user.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByProviderAndProviderId(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { provider, providerId },
    });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async updateLastLogin(userId: string): Promise<User> {
    await this.usersRepository.update(userId, {
      lastLoginAt: new Date(),
    });
    return this.usersRepository.findOne({ where: { id: userId } });
  }
}
