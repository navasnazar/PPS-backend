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

import { NotificationsModule } from '../notifications/notifications.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [
    CoreModule,
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Milestone.name, schema: MilestoneSchema },
      { name: User.name, schema: UserSchema },
      { name: Allocation.name, schema: AllocationSchema },
    ]),
    NotificationsModule,
  ],
  providers: [DashboardService],
  controllers: [DashboardController],
})
export class DashboardModule { }
