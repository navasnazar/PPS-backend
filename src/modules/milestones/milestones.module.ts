import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Milestone, MilestoneSchema } from './milestones.schema';
import { MilestonesService } from './milestones.service';
import { MilestonesController } from './milestones.controller';
import { ActivityLogsModule } from '../activitylogs/activitylogs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Milestone.name, schema: MilestoneSchema },
    ]),
    ActivityLogsModule,
  ],
  providers: [MilestonesService],
  controllers: [MilestonesController],
})
export class MilestonesModule {}
