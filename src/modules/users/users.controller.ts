import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('admin', 'management')
  @Get()
  async getUsers(@CurrentUser() user: any) {
    return this.usersService.getUsers(user);
  }

  @Roles('admin')
  @Post()
  async createUser(@Body() dto: any, @CurrentUser() user: any) {
    return this.usersService.createUser({
      ...dto,
      organizationId: user.organizationId,
    });
  }
}
