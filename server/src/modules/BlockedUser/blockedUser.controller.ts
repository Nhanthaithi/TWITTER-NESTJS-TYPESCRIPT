import { Types } from 'mongoose';
import { AuthUserGuard } from 'src/Guard/auth.guard';
import { ExtendedRequest } from 'src/Types/Types';

// blocked-users.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { BlockedUsersService } from './BlockedUser.service';

@Controller('api/v1/blocked-users')
export class BlockedUsersController {
  constructor(private readonly blockedUsersService: BlockedUsersService) {}
  //CREATE A BLOCKED USER
  @Post()
  @UseGuards(AuthUserGuard)
  async blockUser(
    @Req() req: ExtendedRequest,
    @Body('blockedUserId') blockedUserId: string,
  ) {
    try {
      const userId_current = req.userId;
      const data = {
        userId_current: new Types.ObjectId(userId_current),
        blockedUserId: new Types.ObjectId(blockedUserId),
      };
      return this.blockedUsersService.blockUser(data);
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
  // Thêm các endpoints khác nếu cần
  @Post('is-blocked')
  @UseGuards(AuthUserGuard)
  async isBlocked(
    @Req() req: ExtendedRequest,
    @Body('blockedUserId') blockedUserId: string,
  ) {
    try {
      const userId_current = req.userId;
      const data = {
        userId_current: new Types.ObjectId(userId_current),
        blockedUserId: new Types.ObjectId(blockedUserId),
      };
      const isBlocked = await this.blockedUsersService.isUserBlocked(data);
      return isBlocked;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
  //GET ALL BLOCKED USERS
  @Get('')
  @UseGuards(AuthUserGuard)
  async getAllBlockedUsers(@Req() req: ExtendedRequest) {
    try {
      return await this.blockedUsersService.getAllBlockedUsers(req.userId);
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
  //UNBLOCK USER
  @Delete('/unblock')
  @UseGuards(AuthUserGuard)
  async unblockUser(
    @Req() req: ExtendedRequest,
    @Body('blockedUserId') blockedUserId: string,
  ): Promise<{ message: string }> {
    console.log(blockedUserId);
    try {
      const userId_current = req.userId;
      const data = {
        userId_current: new Types.ObjectId(userId_current),
        blockedUserId: new Types.ObjectId(blockedUserId),
      };
      return await this.blockedUsersService.unblockUser(data);
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}
