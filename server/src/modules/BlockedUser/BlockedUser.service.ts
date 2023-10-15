import { Model, Types } from 'mongoose';

// blocked-users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ICreateBlockedUserDTO } from './DTO/blockedUser.Dto';
import { BlockedUser, BlockedUserDocument } from './schema/BlockedUser.schema';

@Injectable()
export class BlockedUsersService {
  constructor(
    @InjectModel(BlockedUser.name)
    private blockedUserModel: Model<BlockedUserDocument>,
  ) {}
  //CREATE BLOCKED USER
  async blockUser(
    data: ICreateBlockedUserDTO,
  ): Promise<BlockedUser | { message: string }> {
    const findBlockedUser = await this.blockedUserModel.findOne({
      userId_current: new Types.ObjectId(data.userId_current.toString()),
      blockedUserId: new Types.ObjectId(data.blockedUserId.toString()),
    });
    if (findBlockedUser) return { message: 'Blocked user already' };
    const blockedUser = new this.blockedUserModel({
      userId_current: data.userId_current,
      blockedUserId: data.blockedUserId,
    });
    return await blockedUser.save();
  }
  //CHECK BLOCKED USER
  async isUserBlocked(data: ICreateBlockedUserDTO): Promise<boolean> {
    // Kiểm tra xem người dùng hiện tại có đang chặn người dùng khác không
    const userIsBlocking = await this.blockedUserModel.findOne({
      userId_current: new Types.ObjectId(data.userId_current.toString()),
      blockedUserId: new Types.ObjectId(data.blockedUserId.toString()),
    });

    // Kiểm tra xem người dùng hiện tại có đang bị người dùng khác chặn không
    const userIsBlocked = await this.blockedUserModel.findOne({
      userId_current: new Types.ObjectId(data.blockedUserId.toString()),
      blockedUserId: new Types.ObjectId(data.userId_current.toString()),
    });

    return !!(userIsBlocking || userIsBlocked);
  }
  //GET ALL BLOCKED USERS
  async getAllBlockedUsers(userId: string): Promise<BlockedUser[]> {
    const listBlocks = await this.blockedUserModel
      .find({
        userId_current: new Types.ObjectId(userId),
      })
      .populate('blockedUserId')
      .sort({ createdAt: -1 })
      .exec();
    return listBlocks;
  }
  // UNBLOCK USER
  async unblockUser(data: ICreateBlockedUserDTO): Promise<{ message: string }> {
    const result = await this.blockedUserModel.findOneAndDelete({
      userId_current: new Types.ObjectId(data.userId_current.toString()),
      blockedUserId: new Types.ObjectId(data.blockedUserId.toString()),
    });

    if (result) {
      return { message: 'Unblocked user successfully' };
    } else {
      return { message: 'No block relationship found' };
    }
  }
}
