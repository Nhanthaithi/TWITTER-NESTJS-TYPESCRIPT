import { Document, Types } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type TweetDocument = Tweet & Document;

@Schema({ timestamps: true, collection: 'Tweets' })
export class Tweet {
  @Prop({
    type: String,
    enum: ['tweet', 'comment', 'retweet', 'quote'],
    default: 'tweet',
  })
  type: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: Types.ObjectId, ref: 'Tweet', default: null })
  parentId: Types.ObjectId;

  @Prop({ type: [String], default: null })
  hashtags: string[];

  @Prop({ type: [Types.ObjectId], default: null })
  mentions: string[];

  @Prop({ type: [String], default: [] })
  medias: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  likes: Types.ObjectId[];
}

export const TweetSchema = SchemaFactory.createForClass(Tweet);
