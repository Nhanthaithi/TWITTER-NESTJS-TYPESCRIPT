import { IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateFollowDto {
  @IsNotEmpty()
  current_userId: Types.ObjectId;

  @IsNotEmpty()
  followed_userId: Types.ObjectId;
}
