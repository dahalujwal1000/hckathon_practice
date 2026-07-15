import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsController } from './controller/appointments.controller';
import { AppointmentsService } from './service/appointments.service';
import { AppointmentsRepository } from './repository/appointments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, AppointmentsRepository],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}