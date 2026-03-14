import { Controller, Get, UseGuards } from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles('admin', 'management')
  @Get('portfolio')
  getPortfolio(@CurrentUser() user: any) {
    return this.dashboardService.getPortfolioSummary(user);
  }

  @Roles('admin', 'management')
  @Get('risks')
  getProjectRisks(@CurrentUser() user: any) {
    return this.dashboardService.getProjectRisks(user);
  }

  @Roles('admin', 'management')
  @Get('workload')
  getEmployeeWorkload(@CurrentUser() user: any) {
    return this.dashboardService.getEmployeeWorkload(user);
  }

  @Roles('admin', 'management')
  @Get('health')
  getPortfolioHealth(@CurrentUser() user: any) {
    return this.dashboardService.getPortfolioHealth(user);
  }

  @Roles('admin', 'management')
  @Get('delays')
  getDelayedMilestones(@CurrentUser() user: any) {
    return this.dashboardService.getDelayedMilestones(user);
  }
}
