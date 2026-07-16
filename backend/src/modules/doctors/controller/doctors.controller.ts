import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DoctorsService } from '../service/doctors.service';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto } from '../dto/update-doctor.dto';
import { QueryDoctorDto } from '../dto/query-doctor.dto';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { RolesGuard } from 'common/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  async getDoctors(@Query() queryDto: QueryDoctorDto) {
    const [data, total] = await this.doctorsService.getDoctors(queryDto);
    return {
      data,
      meta: {
        page: queryDto.page,
        limit: queryDto.limit,
        total,
      },
    };
  }

  @Get(':id')
  async getDoctorById(@Param('id') id: string) {
    return this.doctorsService.getDoctorById(id);
  }

  @Post()
  @Roles(UserRole.ADMIN) // Only admin can create doctors via this endpoint
  async createDoctor(@Body() createDto: CreateDoctorDto) {
    return this.doctorsService.createDoctor(createDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN) // Could also allow doctor to update own profile; extended later
  async updateDoctor(@Param('id') id: string, @Body() updateDto: UpdateDoctorDto) {
    return this.doctorsService.updateDoctor(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteDoctor(@Param('id') id: string) {
    await this.doctorsService.deleteDoctor(id);
    return { message: 'Doctor deleted successfully' };
  }
}