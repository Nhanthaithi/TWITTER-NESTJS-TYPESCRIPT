// src/notification/dto/create-notification.dto.ts

import { Types } from 'mongoose';

export class CreateNotificationDto {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  type: string;
  tweetId: Types.ObjectId;
}
