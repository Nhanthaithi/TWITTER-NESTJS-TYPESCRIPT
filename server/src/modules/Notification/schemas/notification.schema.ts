// src/notification/schemas/notification.schema.ts

import { Document, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, ref: 'User' })
  senderId: Types.ObjectId;

  @Prop({ required: true, ref: 'User' })
  receiverId: Types.ObjectId;

  @Prop({ required: true })
  type: string;
  @Prop({ required: true, ref: 'Tweet' })
  tweetId: Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
