import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('milestones')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Roles('admin')
  @Post()
  createMilestone(@Body() dto: CreateMilestoneDto, @CurrentUser() user: any) {
    return this.milestonesService.createMilestone(dto, user);
  }

  @Roles('admin', 'management', 'employee')
  @Get()
  findMilestones(
    @Query('projectId') projectId: string,
    @CurrentUser() user: any,
  ) {
    return this.milestonesService.findMilestones(projectId, user);
  }
}
