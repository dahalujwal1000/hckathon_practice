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
import { AmbulanceService } from '../service/ambulance.service';
import { CreateAmbulanceDto } from '../dto/create-ambulance.dto';
import { UpdateAmbulanceDto } from '../dto/update-ambulance.dto';
import { QueryAmbulanceDto } from '../dto/query-ambulance.dto';
import { JwtAuthGuard } from 'common/guards/jwt-auth.guard';
import { RolesGuard } from 'common/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { UserRole } from '../../users/entities/user.entity';

@Controller('ambulances')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AmbulanceController {
  constructor(private readonly ambulanceService: AmbulanceService) {}

  @Get()
  async getAmbulances(@Query() queryDto: QueryAmbulanceDto) {
    const [data, total] = await this.ambulanceService.getAmbulances(queryDto);
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
  async getAmbulanceById(@Param('id') id: string) {
    return this.ambulanceService.getAmbulanceById(id);
  }

  @Get('near')
  async getNearby(
    @Query('lat') latitude: number,
    @Query('lng') longitude: number,
    @Query('distance') distance: number = 10, // default 10 km
  ) {
    return this.ambulanceService.getNearbyAmbulances(
      Number(latitude),
      Number(longitude),
      Number(distance),
    );
  }

  @Get('hospital/:hospitalId')
  async getByHospital(@Param('hospitalId') hospitalId: string) {
    return this.ambulanceService.getAmbulancesByHospitalId(hospitalId);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async createAmbulance(@Body() createDto: CreateAmbulanceDto) {
    return this.ambulanceService.createAmbulance(createDto);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async updateAmbulance(
    @Param('id') id: string,
    @Body() updateDto: UpdateAmbulanceDto,
  ) {
    return this.ambulanceService.updateAmbulance(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteAmbulance(@Param('id') id: string) {
    await this.ambulanceService.deleteAmbulance(id);
    return { message: 'Ambulance deleted successfully' };
  }
}