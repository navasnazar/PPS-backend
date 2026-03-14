import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Milestone, MilestoneDocument } from './milestones.schema';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { ActivityLogsService } from '../activitylogs/activitylogs.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class MilestonesService {
  constructor(
    @InjectModel(Milestone.name)
    private milestoneModel: Model<MilestoneDocument>,
    private activityLogsService: ActivityLogsService,
    private projectsService: ProjectsService,
  ) { }

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

  async updateMilestone(
    milestoneId: string,
    dto: any,
    user: any
  ) {

    const milestone = await this.milestoneModel.findOneAndUpdate(
      {
        _id: milestoneId,
        organizationId: user.organizationId
      },
      dto,
      { returnDocument: 'after' }
    );

    if (!milestone) return null;

    // Activity log
    await this.activityLogsService.logActivity({
      userId: user.userId,
      organizationId: user.organizationId,
      action: 'UPDATE',
      entityType: 'MILESTONE',
      entityId: milestone._id,
      description: `Updated milestone ${milestone.title}`
    });

    // Recalculate project progress
    await this.projectsService.recalculateProjectProgress(
      milestone.projectId.toString()
    );

    return milestone;

  }

  async deleteMilestone(milestoneId: string, user: any) {

    const milestone = await this.milestoneModel.findOneAndDelete({
      _id: milestoneId,
      organizationId: user.organizationId
    });

    if (!milestone) return null;

    await this.activityLogsService.logActivity({
      userId: user.userId,
      organizationId: user.organizationId,
      action: 'DELETE',
      entityType: 'MILESTONE',
      entityId: milestone._id,
      description: `Deleted milestone ${milestone.title}`
    });

    await this.projectsService.recalculateProjectProgress(
      milestone.projectId.toString()
    );

    return milestone;

  }
}
