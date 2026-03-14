import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Allocation, AllocationDocument } from './allocations.schema';
import { CreateAllocationDto } from './dto/create-allocation.dto';
import { ActivityLogsService } from '../activitylogs/activitylogs.service';

@Injectable()
export class AllocationsService {
  constructor(
    @InjectModel(Allocation.name)
    private allocationModel: Model<AllocationDocument>,
    private activityLogsService: ActivityLogsService,
  ) { }

  async createAllocation(dto: CreateAllocationDto, user: any) {
    const existing = await this.allocationModel.findOne({
      userId: dto.userId,
      milestoneId: dto.milestoneId,
      organizationId: user.organizationId,
    });

    if (existing) {
      throw new ConflictException('User already allocated to this milestone');
    }

    const allocation = new this.allocationModel({
      ...dto,
      organizationId: user.organizationId,
    });

    await this.activityLogsService.logActivity({
      userId: user.userId,
      organizationId: user.organizationId,
      action: 'CREATE',
      entityType: 'ALLOCATION',
      entityId: allocation._id,
      description: `Created allocation percentage ${dto.allocationPercentage}`,
    });

    return allocation.save();
  }

  async getAllocationsByMilestone(milestoneId: string, user: any) {
    return this.allocationModel.find({
      milestoneId,
      organizationId: user.organizationId,
    });
  }

  async updateAllocation(
    allocationId: string,
    dto: any,
    user: any
  ) {

    const allocation = await this.allocationModel.findOneAndUpdate(
      {
        _id: allocationId,
        organizationId: user.organizationId
      },
      dto,
      { returnDocument: 'after' }
    );

    if (!allocation) return null;

    await this.activityLogsService.logActivity({
      userId: user.userId,
      organizationId: user.organizationId,
      action: 'UPDATE',
      entityType: 'ALLOCATION',
      entityId: allocation._id,
      description: `Updated allocation percentage`
    });

    return allocation;

  }

  async deleteAllocation(allocationId: string, user: any) {

    const allocation = await this.allocationModel.findOneAndDelete({
      _id: allocationId,
      organizationId: user.organizationId
    });

    if (!allocation) return null;

    await this.activityLogsService.logActivity({
      userId: user.userId,
      organizationId: user.organizationId,
      action: 'DELETE',
      entityType: 'ALLOCATION',
      entityId: allocation._id,
      description: `Removed allocation`
    });

    return allocation;

  }
}
