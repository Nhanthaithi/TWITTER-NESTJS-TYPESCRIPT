import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  BlockedUser,
  BlockedUserSchema,
} from '../BlockedUser/schema/BlockedUser.schema';
import { User, UserSchema } from '../User/schemas/user.schema';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { Follow, FollowSchema } from './Schemas/follow.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Follow.name, schema: FollowSchema },
      { name: User.name, schema: UserSchema },
      { name: BlockedUser.name, schema: BlockedUserSchema },
    ]),
  ],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
