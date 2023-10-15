// blocked-users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BlockedUsersController } from './blockedUser.controller';
import { BlockedUsersService } from './BlockedUser.service';
import { BlockedUser, BlockedUserSchema } from './schema/BlockedUser.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlockedUser.name, schema: BlockedUserSchema },
    ]),
  ],
  providers: [BlockedUsersService],
  controllers: [BlockedUsersController],
})
export class BlockedUsersModule {}
