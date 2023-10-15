import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

import {
  BlockedUser,
  BlockedUserSchema,
} from '../BlockedUser/schema/BlockedUser.schema';
import { RevenueModule } from '../Revenue/revenue.module';
import { RevenueService } from '../Revenue/revenue.service';
import { EmailUniqueGuard } from './Guard/EmailUniqueGuard ';
import { UserSchema } from './schemas/user.schema';
import { MailService } from './Service/nodemailer.service';
import { UserService } from './Service/user.service';
import { GoogleStrategy } from './Strategy/google.strategy';
import { UsersController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: BlockedUser.name, schema: BlockedUserSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET || 'Nhana9093@',
      signOptions: { expiresIn: '2d' },
    }),
    PassportModule,
    RevenueModule,
  ],
  controllers: [UsersController],
  providers: [
    UserService,
    EmailUniqueGuard,
    MailService,
    GoogleStrategy,
    RevenueService,
  ],
})
export class UserModule {}
