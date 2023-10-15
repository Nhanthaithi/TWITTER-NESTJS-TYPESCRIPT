import * as mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, collection: 'Following' })
export class Follow extends mongoose.Document {
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  current_userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  followed_userId: mongoose.Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
