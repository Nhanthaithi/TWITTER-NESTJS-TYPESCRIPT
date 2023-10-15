import { Model, Types } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  BlockedUser,
  BlockedUserDocument,
} from '../BlockedUser/schema/BlockedUser.schema';
import { User } from '../User/schemas/user.schema';
import { CreateFollowDto } from './DTO/Follow.DTO';
import { Follow } from './Schemas/follow.schemas';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private followModel: Model<Follow>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(BlockedUser.name)
    private blockedUserModel: Model<BlockedUserDocument>,
  ) {}
  //**CREATE A FOLLOW
  async followUser(data: CreateFollowDto): Promise<{ mesage: string }> {
    const newFollow = new this.followModel(data);
    await newFollow.save();
    return { mesage: 'Followed successfully' };
  }
  //**DELETE A FOLLOW
  async unfollowUser(
    currentUserId: string,
    userIdToUnfollow: string,
  ): Promise<{ mesage: string }> {
    await this.followModel.findOneAndDelete({
      current_userId: new Types.ObjectId(currentUserId),
      followed_userId: new Types.ObjectId(userIdToUnfollow),
    });

    return { mesage: 'Unfollowed successfully' };
  }

  //**CHECK FOLLOW OR NOT
  async isFollowing(
    currentUserId: string,
    userIdToCheck: string,
  ): Promise<{ isFollowing: boolean }> {
    const Following = await this.followModel.findOne({
      current_userId: new Types.ObjectId(currentUserId),
      followed_userId: new Types.ObjectId(userIdToCheck),
    });
    if (!Following) {
      return { isFollowing: false };
    }
    return { isFollowing: true };
  }

  //**GET ALL FOLLOWING BY USERID
  async getFollowingByUserId(userId: string): Promise<User[]> {
    const followings = await this.followModel.find({
      current_userId: new Types.ObjectId(userId),
    });
    const followingUserIds = followings.map(
      (follow) => follow?.followed_userId,
    );
    const listUserFollowings = await this.userModel
      .find({
        _id: { $in: followingUserIds },
      })
      .select('-password');
    return listUserFollowings;
  }
  //** */ GET USERS WHO ARE FOLLOWING A PARTICULAR USER BY ID
  async getFollowersByUserId(userId: string): Promise<User[]> {
    const followers = await this.followModel.find({
      followed_userId: new Types.ObjectId(userId),
    });
    const followerUserIds = followers.map((follow) => follow?.current_userId);
    const listUserFollowers = await this.userModel
      .find({ _id: { $in: followerUserIds } })
      .select('-password');
    return listUserFollowers;
  }
  //   ** GET RANDOM SUGGESTION FOLLOW
  async getRandomFollowSuggestions(currentUserId: string): Promise<User[]> {
    // Lấy danh sách ID của những người dùng mà người dùng hiện tại đã follow
    const followedUsers = await this.followModel.find({
      current_userId: new Types.ObjectId(currentUserId),
    });
    const followedUserIds = followedUsers.map(
      (follow) => follow?.followed_userId,
    );
    // Lấy danh sách ID của những người dùng mà người dùng hiện tại đã chặn và đã chặn người dùng hiện tại
    const blockedByCurrentUser = await this.blockedUserModel.find({
      userId_current: new Types.ObjectId(currentUserId),
    });
    const blockedCurrentUser = await this.blockedUserModel.find({
      blockedUserId: new Types.ObjectId(currentUserId),
    });

    const blockedUserIds = [
      ...new Set([
        ...blockedByCurrentUser.map((u) => u.blockedUserId),
        ...blockedCurrentUser.map((u) => u.userId_current),
      ]),
    ];

    // Thêm ID của người dùng hiện tại vào danh sách để tránh lấy thông tin của chính họ
    const excludedUserIds = [
      ...followedUserIds,
      ...blockedUserIds,
      new Types.ObjectId(currentUserId),
    ];
    // Lấy 10 người dùng mà người dùng hiện tại chưa follow
    const usersToFollow = await this.userModel
      .aggregate([
        { $match: { _id: { $nin: excludedUserIds } } },
        { $project: { password: 0 } },
        { $sample: { size: 10 } },
      ])
      .exec();

    return usersToFollow;
  }
}
