import { Transform } from 'class-transformer';
import { IsArray, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class TweetCreateDto {
  type: string;

  author: Types.ObjectId;

  content: string;

  @IsOptional()
  parentId?: Types.ObjectId;

  @IsOptional()
  @IsArray()
  hashtags?: string[];

  @IsOptional()
  @IsArray()
  mentions?: string[];

  @IsOptional()
  @IsArray()
  medias?: string[];

  @IsOptional()
  @IsArray()
  likes?: Types.ObjectId[];
}

export class CreateCommentDTO {
  content: string;

  @Transform((value) => new Types.ObjectId(value.value as string))
  parentId: Types.ObjectId;
}
