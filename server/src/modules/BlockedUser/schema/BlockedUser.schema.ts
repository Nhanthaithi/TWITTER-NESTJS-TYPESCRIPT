import { Document, ObjectId, Types } from 'mongoose';

// blocked-user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BlockedUserDocument = BlockedUser & Document;

@Schema({ timestamps: true })
export class BlockedUser {
  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId_current: ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  blockedUserId: ObjectId;
}

export const BlockedUserSchema = SchemaFactory.createForClass(BlockedUser);
