import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

import { Project, ProjectSchema } from '../projects/projects.schema';
import { Milestone, MilestoneSchema } from '../milestones/milestones.schema';
import { User, UserSchema } from '../users/users.schema';
import {
  Allocation,
  AllocationSchema,
} from '../allocations/allocations.schema';
import { DashboardGateway } from './dashboard.gateway';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Milestone.name, schema: MilestoneSchema },
      { name: User.name, schema: UserSchema },
      { name: Allocation.name, schema: AllocationSchema },
    ]),
    NotificationsModule,
  ],
  providers: [DashboardService, DashboardGateway],
  controllers: [DashboardController],
  exports: [DashboardGateway],
})
export class DashboardModule {}
