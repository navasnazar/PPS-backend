import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ActivityLog, ActivityLogDocument } from './activitylogs.schema';

@Injectable()
export class ActivityLogsService {
  constructor(
    @InjectModel(ActivityLog.name)
    private activityModel: Model<ActivityLogDocument>,
  ) { }

  async logActivity(data: any) {
    const log = new this.activityModel(data);
    return log.save();
  }

  async getActivities(organizationId: string) {
    return this.activityModel
      .find({ organizationId })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async getProjectActivity(projectId: string) {
    this.activityModel
      .find({
        entityType: 'PROJECT',
        entityId: projectId
      })
      .sort({ createdAt: -1 })
      .limit(100);

  }
}
