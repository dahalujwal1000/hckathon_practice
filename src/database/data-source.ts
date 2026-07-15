import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  // These will be overridden by the factory function in TypeOrmModule.forRootAsync
  host: '',
  port: 0,
  username: '',
  password: '',
  database: '',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  subscribers: [__dirname + '/subscribers/*{.ts,.js}'],
  logging: true,
  synchronize: false,
});