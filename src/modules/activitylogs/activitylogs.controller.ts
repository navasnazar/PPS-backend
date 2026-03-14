import { Controller, Get, UseGuards, Param } from '@nestjs/common';

import { ActivityLogsService } from './activitylogs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('activitylogs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivityLogsController {
  constructor(private readonly activityService: ActivityLogsService) { }

  @Roles('admin')
  @Get()
  getLogs(@CurrentUser() user: any) {
    return this.activityService.getActivities(user.organizationId);
  }
  @Roles('admin','management')
  @Get('projects/:id/activity')
  getProjectActivity(@Param('id') projectId: string) {
    return this.activityService.getProjectActivity(projectId);
  }
}
