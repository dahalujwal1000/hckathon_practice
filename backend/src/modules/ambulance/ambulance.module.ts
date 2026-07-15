import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ambulance } from './entities/ambulance.entity';
import { AmbulanceController } from './controller/ambulance.controller';
import { AmbulanceService } from './service/ambulance.service';
import { AmbulanceRepository } from './repository/ambulance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Ambulance])],
  controllers: [AmbulanceController],
  providers: [AmbulanceService, AmbulanceRepository],
  exports: [AmbulanceService],
})
export class AmbulanceModule {}