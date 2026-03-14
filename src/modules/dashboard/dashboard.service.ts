import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Project, ProjectDocument } from '../projects/projects.schema';
import { Milestone, MilestoneDocument } from '../milestones/milestones.schema';
import { User, UserDocument } from '../users/users.schema';
import {
  Allocation,
  AllocationDocument,
} from '../allocations/allocations.schema';
import { Types } from 'mongoose';
import { NotificationsService } from '../notifications/notifications.service';
import { DashboardGateway } from 'src/core/gateways/dashboard.gateway';


@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,

    @InjectModel(Milestone.name)
    private milestoneModel: Model<MilestoneDocument>,

    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    @InjectModel(Allocation.name)
    private allocationModel: Model<AllocationDocument>,

    private notificationsService: NotificationsService,
    private dashboardGateway: DashboardGateway,
  ) {}

  async getPortfolioSummary(user: any) {
    const organizationId = user.organizationId;

    const totalProjects = await this.projectModel.countDocuments({
      organizationId,
    });

    const activeProjects = await this.projectModel.countDocuments({
      organizationId,
      status: { $ne: 'completed' },
    });

    const completedProjects = await this.projectModel.countDocuments({
      organizationId,
      status: 'completed',
    });

    const totalMilestones = await this.milestoneModel.countDocuments({
      organizationId,
    });

    const completedMilestones = await this.milestoneModel.countDocuments({
      organizationId,
      status: 'completed',
    });

    const totalEmployees = await this.userModel.countDocuments({
      organizationId,
    });

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalMilestones,
      completedMilestones,
      totalEmployees,
    };
  }

  async getProjectRisks(user: any) {
    const organizationId = user.organizationId;

    const projects = await this.projectModel.find({ organizationId });

    const today = new Date();

    const risks = projects
      .map((project) => {
        if (!project.targetDate) {
          return {
            projectId: project._id,
            projectName: project.name,
            progress: project.progress,
            daysLeft: null,
            riskLevel: 'NO_DEADLINE',
          };
        }

        const diffTime = project.targetDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let riskLevel = 'LOW';

        if (daysLeft < 7 && project.progress < 50) {
          riskLevel = 'HIGH';
        } else if (daysLeft < 14 && project.progress < 70) {
          riskLevel = 'MEDIUM';
        }

        return {
          projectId: project._id,
          projectName: project.name,
          progress: project.progress,
          daysLeft,
          riskLevel,
        };
      })
      .filter(Boolean);

    return risks;
  }

  async getEmployeeWorkload(user: any) {
    const organizationId = new Types.ObjectId(user.organizationId);

    const workloads = await this.allocationModel.aggregate([
      {
        $match: { organizationId },
      },
      {
        $group: {
          _id: '$userId',
          totalAllocation: { $sum: '$allocationPercentage' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          totalAllocation: 1,
          status: {
            $cond: [{ $gt: ['$totalAllocation', 100] }, 'OVERLOADED', 'NORMAL'],
          },
        },
      },
    ]);

    return workloads;
  }

  async getPortfolioHealth(user: any) {
    const organizationId = user.organizationId;

    const projects = await this.projectModel.find({ organizationId });

    if (!projects.length) {
      return { healthScore: 0 };
    }

    const avgProgress =
      projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length;

    let riskPenalty = 0;

    const today = new Date();

    projects.forEach((project) => {
      if (!project.targetDate) return;

      const daysLeft =
        (project.targetDate.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24);

      if (daysLeft < 7 && project.progress < 50) {
        riskPenalty += 15;
      } else if (daysLeft < 14 && project.progress < 70) {
        riskPenalty += 7;
      }
    });

    const workloads = await this.allocationModel.aggregate([
      {
        $match: { organizationId },
      },
      {
        $group: {
          _id: '$userId',
          totalAllocation: { $sum: '$allocationPercentage' },
        },
      },
    ]);

    let workloadPenalty = 0;

    workloads.forEach((w) => {
      if (w.totalAllocation > 100) {
        workloadPenalty += 5;
      }
    });

    let healthScore = avgProgress - riskPenalty - workloadPenalty;

    if (healthScore < 0) healthScore = 0;
    if (healthScore > 100) healthScore = 100;

    return {
      healthScore: Math.round(healthScore),
      avgProgress: Math.round(avgProgress),
      riskPenalty,
      workloadPenalty,
    };
  }

  async getDelayedMilestones(user: any) {
    const organizationId = user.organizationId;

    const today = new Date();

    const milestones = await this.milestoneModel
      .find({
        organizationId,
        deadline: { $lt: today },
        status: { $ne: 'completed' },
      })
      .populate('projectId', 'name');

    const result = milestones.map((m) => {
      const delayDays = Math.ceil(
        (today.getTime() - m.deadline.getTime()) / (1000 * 60 * 60 * 24),
      );
        this.notificationsService.createNotification({
        userId: user.userId,
        organizationId: user.organizationId,
        type: 'MILESTONE_DELAY',
        message: `Milestone "${m.title}" is delayed`
      });
      
      this.dashboardGateway.emitDashboardUpdate({
        type: 'MILESTONE_DELAY',
        milestone: m.title,
        project: (m.projectId as any)?.name
      });

      return {
        milestoneId: m._id,
        milestoneName: m.title,
        projectName: (m.projectId as any)?.name,
        delayDays,
      };
    });

    return result;
  }
}
