import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { DoctorsController } from './controller/doctors.controller';
import { DoctorsService } from './service/doctors.service';
import { DoctorsRepository } from './repository/doctors.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])],
  controllers: [DoctorsController],
  providers: [DoctorsService, DoctorsRepository],
  exports: [DoctorsService],
})
export class DoctorsModule {}