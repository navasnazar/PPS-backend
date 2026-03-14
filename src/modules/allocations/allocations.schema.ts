import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AllocationDocument = Allocation & Document;

@Schema({ timestamps: true })
export class Allocation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Milestone', required: true })
  milestoneId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 100 })
  allocationPercentage: number;
}

export const AllocationSchema = SchemaFactory.createForClass(Allocation);

AllocationSchema.index({ userId: 1, milestoneId: 1 }, { unique: true });
