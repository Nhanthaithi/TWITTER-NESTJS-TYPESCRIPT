import { HydratedDocument } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  fullname: string;

  @Prop()
  username: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: [0, 1], default: 1 })
  status: number;

  @Prop({ default: '' })
  email_verify_token: string;

  @Prop({ default: '' })
  forgot_password_token: string;

  @Prop({ enum: [0, 1, 2], default: 0 })
  verify: number;

  @Prop({ enum: [0, 1], default: 0 })
  role: number;

  @Prop({
    default:
      'https://vietabinhdinh.edu.vn/wp-content/uploads/Hinh-Avatar-Trang-dep-chat-va-cuc-doc-dao-cho.jpg',
  })
  avatar: string;

  @Prop({
    default:
      'https://ss-images.saostar.vn/fb1200png_2/2023/5/15/pc/1684126868405/saostar-mj1g89rrg3blzz2j.jpg/fbsscover.png',
  })
  cover_photo: string;
  @Prop({ enum: [1, 2] })
  type_login: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
