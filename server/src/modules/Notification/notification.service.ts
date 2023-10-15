// src/notification/notification.service.ts

import { Model, Types } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CreateNotificationDto } from './DTO/notification.DTO';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const createdNotification = new this.notificationModel(
      createNotificationDto,
    );
    return createdNotification.save();
  }

  async findAll(receiverId: string): Promise<Notification[]> {
    return this.notificationModel
      .find({ receiverId: new Types.ObjectId(receiverId) })
      .populate('senderId')
      .sort({ createdAt: -1 })
      .exec();
  }
}
