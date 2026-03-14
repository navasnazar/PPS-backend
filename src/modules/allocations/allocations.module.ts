import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Allocation, AllocationSchema } from './allocations.schema';
import { AllocationsService } from './allocations.service';
import { AllocationsController } from './allocations.controller';
import { ActivityLogsModule } from '../activitylogs/activitylogs.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Allocation.name, schema: AllocationSchema },
    ]),
    ActivityLogsModule,
  ],
  providers: [AllocationsService],
  controllers: [AllocationsController],
})
export class AllocationsModule {}
