import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './users.schema';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async createUser(data: Partial<User>) {
    const existingUser = await this.userModel.findOne({
      email: data.email,
      organizationId: data.organizationId,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists in this organization');
    }

    const hashedPassword = await bcrypt.hash(data.password!, 10);

    const user = new this.userModel({
      ...data,
      password: hashedPassword,
    });

    return user.save();
  }

  async getUsers(user: any) {
    return this.userModel
      .find({ organizationId: user.organizationId })
      .select('-password')
      .sort({ createdAt: -1 });
  }
}
