import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from './entities/hospital.entity';
import { HospitalsController } from './controller/hospitals.controller';
import { HospitalsService } from './service/hospitals.service';
import { HospitalsRepository } from './repository/hospitals.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital])],
  controllers: [HospitalsController],
  providers: [HospitalsService, HospitalsRepository],
  exports: [HospitalsService],
})
export class HospitalsModule {}