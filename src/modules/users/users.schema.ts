import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: Types.ObjectId, ref: 'Organization', required: true })
  organizationId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    enum: ['admin', 'management', 'employee'],
    default: 'employee',
  })
  role: string;

  @Prop()
  designation: string;

  @Prop()
  department: string;

  @Prop()
  country: string;

  @Prop()
  timezone: string;

  @Prop({ default: 'active' })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1, organizationId: 1 }, { unique: true });
