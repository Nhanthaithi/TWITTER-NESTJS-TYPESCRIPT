import { Types } from 'mongoose';

export interface ICreateBlockedUserDTO {
  userId_current: Types.ObjectId;
  blockedUserId: Types.ObjectId;
}
