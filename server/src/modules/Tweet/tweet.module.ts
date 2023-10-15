import { TweetGateway } from 'src/Socket/tweet.gateway';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  BlockedUser,
  BlockedUserSchema,
} from '../BlockedUser/schema/BlockedUser.schema';
import { FollowService } from '../Follow/follow.service';
import { Follow, FollowSchema } from '../Follow/Schemas/follow.schemas';
import { NotificationModule } from '../Notification/notification.module';
import { NotificationService } from '../Notification/notification.service';
import { User, UserSchema } from '../User/schemas/user.schema';
import { UserService } from '../User/Service/user.service';
import { Tweet, TweetSchema } from './Schemas/tweet.schemas';
import { TweetController } from './tweet.controller';
import { TweetService } from './Tweet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Tweet.name, schema: TweetSchema },
      { name: Follow.name, schema: FollowSchema },
      { name: BlockedUser.name, schema: BlockedUserSchema },
      { name: User.name, schema: UserSchema },
    ]),
    // Thêm bất kỳ module nào khác mà TweetModule phụ thuộc vào
    NotificationModule,
  ],
  controllers: [TweetController],
  providers: [TweetService, NotificationService, TweetGateway, FollowService],
  exports: [TweetService], // Export TweetService nếu bạn muốn sử dụng nó ở module khác
})
export class TweetModule {}
