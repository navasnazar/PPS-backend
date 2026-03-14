import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProjectDocument = Project & Document;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({
    enum: ['product', 'service', 'internal', 'support'],
    default: 'product',
  })
  type: string;

  @Prop({
    enum: ['planning', 'development', 'testing', 'production', 'maintenance'],
    default: 'planning',
  })
  status: string;

  @Prop({
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  })
  priority: string;

  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop()
  startDate: Date;

  @Prop()
  targetDate: Date;

  @Prop({ default: 0 })
  progress: number;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
