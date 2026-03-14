import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Notification, NotificationDocument } from './notifications.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async createNotification(data: any) {
    const notification = new this.notificationModel(data);

    return notification.save();
  }

  async getUserNotifications(user: any) {
    return this.notificationModel
      .find({
        userId: user.userId,
      })
      .sort({ createdAt: -1 })
      .limit(50);
  }
}
