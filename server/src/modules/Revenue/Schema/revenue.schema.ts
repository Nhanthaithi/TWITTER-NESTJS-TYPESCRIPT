import { Document, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Revenue extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
  @Prop({ default: 'Forever' })
  expirationDate: Date;
  @Prop({ required: true })
  price: number;
}

export const RevenueSchema = SchemaFactory.createForClass(Revenue);
