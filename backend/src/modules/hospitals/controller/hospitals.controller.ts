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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HospitalsService } from '../service/hospitals.service';
import { CreateHospitalDto } from '../dto/create-hospital.dto';
import { UpdateHospitalDto } from '../dto/update-hospital.dto';
import { QueryHospitalDto } from '../dto/query-hospital.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@Controller('hospitals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Get()
  async getHospitals(@Query() queryDto: QueryHospitalDto) {
    const [data, total] = await this.hospitalsService.getHospitals(queryDto);
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
  async getHospitalById(@Param('id') id: string) {
    return this.hospitalsService.getHospitalById(id);
  }

  @Get('near')
  async getNearby(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('distance') distance: number = 10, // default 10 km
  ) {
    return this.hospitalsService.getNearbyHospitals(
      Number(latitude),
      Number(longitude),
      Number(distance),
    );
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createHospital(@Body() createDto: CreateHospitalDto) {
    return this.hospitalsService.createHospital(createDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateHospital(
    @Param('id') id: string,
    @Body() updateDto: UpdateHospitalDto,
  ) {
    return this.hospitalsService.updateHospital(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteHospital(@Param('id') id: string) {
    await this.hospitalsService.deleteHospital(id);
    return { message: 'Hospital deleted successfully' };
  }
}