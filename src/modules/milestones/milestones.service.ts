import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Milestone, MilestoneDocument } from './milestones.schema';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { ActivityLogsService } from '../activitylogs/activitylogs.service';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectModel(Milestone.name)
    private milestoneModel: Model<MilestoneDocument>,
    private activityLogsService: ActivityLogsService,
  ) {}

  async createMilestone(dto: CreateMilestoneDto, user: any) {
    const existing = await this.milestoneModel.findOne({
      title: dto.title,
      projectId: dto.projectId,
      organizationId: user.organizationId,
    });

    if (existing) {
      throw new ConflictException('Milestone already exists in this project');
    }

    const milestone = new this.milestoneModel({
      ...dto,
      organizationId: user.organizationId,
    });

    await this.activityLogsService.logActivity({
      userId: user.userId,
      organizationId: user.organizationId,
      action: 'CREATE',
      entityType: 'MILESTONE',
      entityId: milestone._id,
      description: `Created milestone ${dto.title}`,
    });

    return milestone.save();
  }

  async findMilestones(projectId: string, user: any) {
    return this.milestoneModel.find({
      projectId,
      organizationId: user.organizationId,
    });
  }
}
