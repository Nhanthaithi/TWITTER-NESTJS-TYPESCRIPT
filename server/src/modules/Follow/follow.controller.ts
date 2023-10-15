import { Response } from 'express';
import { Types } from 'mongoose';
import { AuthUserGuard } from 'src/Guard/auth.guard';
import { ExtendedRequest } from 'src/Types/Types';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';

import { FollowService } from './follow.service';
import { Follow } from './Schemas/follow.schemas';

@Controller('api/v1/follow')
export class FollowController {
  constructor(private followService: FollowService) {}
  //CREATE A FOLLOW
  @Post('follow-user')
  @UseGuards(AuthUserGuard)
  async followUser(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Body() body: any,
  ) {
    const userId = req.userId;
    const userIdToFollow = body.userIdToFollow;
    try {
      const isCheckFollow = await this.followService.isFollowing(
        userId,
        userIdToFollow,
      );
      if (!isCheckFollow.isFollowing) {
        const message = await this.followService.followUser({
          current_userId: new Types.ObjectId(userId.toString()),
          followed_userId: new Types.ObjectId(userIdToFollow.toString()),
        });
        return res.status(200).json(message);
      }
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'You are following this user' });
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  // UNFOLLOW
  @Delete('unfollow-user/:id')
  @UseGuards(AuthUserGuard)
  async unfollowUser(
    @Req() req: ExtendedRequest,
    @Param('id') userIdtoUnfollow: string,
    @Res() res: Response,
  ) {
    try {
      const currentUserId = req.userId;
      const isCheckFollow = await this.followService.isFollowing(
        currentUserId,
        userIdtoUnfollow,
      );
      if (isCheckFollow.isFollowing) {
        const message = await this.followService.unfollowUser(
          currentUserId,
          userIdtoUnfollow,
        );
        return res.status(HttpStatus.OK).json(message);
      } else {
        return res.status(HttpStatus.FORBIDDEN).json({
          message: 'You are not following this user',
        });
      }
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  //** */ GET USER FOLLOWING
  @Get('/following/:id')
  async getUsersFollowingByUserId(
    @Param('id') userId: string,
    @Res() res: Response,
  ) {
    try {
      const listFollowing =
        await this.followService.getFollowingByUserId(userId);
      return res.status(HttpStatus.OK).json(listFollowing);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }
  //** */ GET USER FOLLOW OF ONE USER
  @Get('followers/:id')
  async getUsersWhoFollowByUserId(
    @Param('id') userId: string,
    @Res() res: Response,
  ) {
    try {
      const listFollowers =
        await this.followService.getFollowersByUserId(userId);
      return res.status(HttpStatus.OK).json(listFollowers);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  //** GET RANDOM SUGGEST FOLLOW USER */
  @Get('random-follower')
  @UseGuards(AuthUserGuard)
  async getRandomFollower(@Req() req: ExtendedRequest, @Res() res: Response) {
    try {
      const currentUserId = req.userId;
      const usersToFollow =
        await this.followService.getRandomFollowSuggestions(currentUserId);
      return res.status(HttpStatus.OK).json(usersToFollow);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }

  //** CHECK FOLLOWING OR NOT  */
  @Get('checkFollow/:id')
  @UseGuards(AuthUserGuard)
  async isFollowing(
    @Req() req: ExtendedRequest,
    @Res() res: Response,
    @Param('id') userIdToCheck: string,
  ) {
    try {
      const currentUserId = req.userId;
      const isFollowing = await this.followService.isFollowing(
        currentUserId,
        userIdToCheck,
      );
      return res.status(HttpStatus.OK).json(isFollowing);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
    }
  }
}
