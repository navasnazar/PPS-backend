import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { AllocationsService } from './allocations.service';
import { CreateAllocationDto } from './dto/create-allocation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('allocations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AllocationsController {
  constructor(private readonly allocationsService: AllocationsService) {}

  @Roles('admin')
  @Post()
  createAllocation(@Body() dto: CreateAllocationDto, @CurrentUser() user: any) {
    return this.allocationsService.createAllocation(dto, user);
  }

  @Roles('admin', 'management', 'employee')
  @Get()
  getAllocations(
    @Query('milestoneId') milestoneId: string,
    @CurrentUser() user: any,
  ) {
    return this.allocationsService.getAllocationsByMilestone(milestoneId, user);
  }
}
