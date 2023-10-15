require('dotenv').config();
import { join } from 'path';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';

import { BlockedUsersModule } from './modules/BlockedUser/blockedUser.module';
import { FollowModule } from './modules/Follow/follow.module';
import { NotificationModule } from './modules/Notification/notification.module';
import { RevenueModule } from './modules/Revenue/revenue.module';
import { TweetModule } from './modules/Tweet/tweet.module';
import { UserModule } from './modules/User/user.module';

const dbName = process.env.DB_NAME || 'twitter-nestjs';
@Module({
  imports: [
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '../public') }),
    MongooseModule.forRoot(`mongodb://localhost:27017/${dbName}`),
    UserModule,
    FollowModule,
    TweetModule,
    RevenueModule,
    NotificationModule,
    BlockedUsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
