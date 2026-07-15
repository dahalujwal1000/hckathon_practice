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
import { UsersService } from './service/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from './entities/user.entity';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users - Admin only: Get all users with pagination and filtering
  @Get()
  @Roles(UserRole.ADMIN)
  async getUsers(@Query() queryDto: QueryUserDto) {
    return this.usersService.getUsers(queryDto);
  }

  // GET /users/:id - Users can view their own profile, admins can view any
  @Get(':id')
  async getUserById(
    @Param('id') id: string,
    @CurrentUser() currentUser: User,
  ) {
    // Users can only view their own profile unless they are admin
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      // Forbidden: user trying to access another user's profile
      // We'll throw an exception in the service or here? Let's do it here for clarity.
      // We'll create a custom exception or use ForbiddenException
      // For now, we'll let the service handle it by passing the current user and letting it check.
      // Actually, let's change the service method to take the current user and check.
      // We'll adjust the service later.
      // For now, we'll do the check here and throw an error.
      // We'll import ForbiddenException
      // But to avoid extra imports, we'll let the service handle it by passing the currentUser.
      // We'll change the service method to accept the currentUser and do the check.
      // So we'll pass the currentUser to the service.
      return this.usersService.getUserById(id, currentUser);
    }
    // If admin or same user, proceed
    return this.usersService.getUserById(id, currentUser);
  }

  // POST /users - Admin only: Create a new user
  @Post()
  @Roles(UserRole.ADMIN)
  async createUser(@Body() createDto: CreateUserDto) {
    return this.usersService.createUser(createDto);
  }

  // PATCH /users/:id - Users can update their own profile, admins can update any
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    // Users can only update their own profile unless they are admin
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      // Not authorized - let the service handle it by passing currentUser
      return this.usersService.updateUser(id, updateDto, currentUser);
    }
    // Admin or same user
    return this.usersService.updateUser(id, updateDto, currentUser);
  }

  // DELETE /users/:id - Admin only: Delete a user (soft delete)
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}