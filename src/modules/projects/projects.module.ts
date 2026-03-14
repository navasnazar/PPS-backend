import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Project, ProjectSchema } from './projects.schema';
import { ProjectsService } from './projects.service';
import { ActivityLogsModule } from '../activitylogs/activitylogs.module';
import { ProjectsController } from './projects.controller';
import { Milestone, MilestoneSchema } from '../milestones/milestones.schema';
import { DashboardModule } from '../dashboard/dashboard.module';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: Milestone.name, schema: MilestoneSchema },
    ]),
    CoreModule,
    ActivityLogsModule,
    DashboardModule,
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
  exports: [ProjectsService],
})
export class ProjectsModule { }
