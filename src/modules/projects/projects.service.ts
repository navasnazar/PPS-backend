import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Project, ProjectDocument } from './projects.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { ActivityLogsService } from '../activitylogs/activitylogs.service';
import { Milestone, MilestoneDocument } from '../milestones/milestones.schema';
import { DashboardGateway } from 'src/core/gateways/dashboard.gateway';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,

    @InjectModel(Milestone.name)
    private milestoneModel: Model<MilestoneDocument>,

    private activityLogsService: ActivityLogsService,
    private dashboardGateway: DashboardGateway,
  ) { }

  async createProject(dto: CreateProjectDto, user: any) {
    const project = new this.projectModel({
      ...dto,
      organizationId: user.organizationId,
      ownerId: user.userId,
    });

    await this.activityLogsService.logActivity({
      userId: user.userId,
      organizationId: user.organizationId,
      action: 'CREATE',
      entityType: 'PROJECT',
      entityId: project._id,
      description: `Created project ${dto.name}`,
    });

    return project.save();
  }

  async findProjects(user: any) {
    return this.projectModel.find({
      organizationId: user.organizationId,
    });
  }

  async recalculateProjectProgress(projectId: string) {
    const milestones = await this.milestoneModel.find({ projectId });

    if (!milestones.length) {
      return 0;
    }

    const totalProgress = milestones.reduce(
      (sum, m) => sum + (m.progress || 0),
      0,
    );

    const avgProgress = Math.round(totalProgress / milestones.length);

    await this.projectModel.findByIdAndUpdate(projectId, {
      progress: avgProgress,
    });

    this.dashboardGateway.emitDashboardUpdate({
      projectId,
      progress: avgProgress,
    });

    return avgProgress;
  }

  async updateProject(
    projectId: string,
    dto: any,
    user: any
  ) {

    const project = await this.projectModel.findOneAndUpdate(
      {
        _id: projectId,
        organizationId: user.organizationId
      },
      dto,
      { returnDocument: 'after' }
    );

    if (project) {

      await this.activityLogsService.logActivity({
        userId: user.userId,
        organizationId: user.organizationId,
        action: 'UPDATE',
        entityType: 'PROJECT',
        entityId: project._id,
        description: `Updated project ${project.name}`
      });

    }

    return project;

  }

  async deleteProject(projectId: string, user: any) {

    const project = await this.projectModel.findOneAndDelete({
      _id: projectId,
      organizationId: user.organizationId
    });

    if (project) {

      await this.activityLogsService.logActivity({
        userId: user.userId,
        organizationId: user.organizationId,
        action: 'DELETE',
        entityType: 'PROJECT',
        entityId: project._id,
        description: `Deleted project ${project.name}`
      });

    }

    return project;

  }
}
