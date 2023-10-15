import { Response } from 'express';
import { ObjectId } from 'mongoose';
import { multerUpload } from 'src/config/multer.config';
import { AuthUserGuard } from 'src/Guard/auth.guard';
import { TweetGateway } from 'src/Socket/tweet.gateway';
import { ExtendedRequest } from 'src/Types/Types';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { CreateCommentDTO, TweetCreateDto } from './DTO/tweet.Dto';
import { TweetService } from './Tweet.service';

@Controller('api/v1/tweets')
export class TweetController {
  constructor(
    private tweetService: TweetService,
    private tweetGateway: TweetGateway,
  ) {}

  //CREATE TWEET
  @Post('/')
  @UseGuards(AuthUserGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 3 }], multerUpload),
  )
  async createTweet(
    @UploadedFiles() files: any,
    @Body() tweetDto: TweetCreateDto,
    @Req() req: ExtendedRequest,
  ) {
    try {
      let mediaUrls: string[] = [];
      if (files && files.images) {
        mediaUrls = files.images.map((file: Express.Multer.File) => file.path);
      }
      const data = await this.tweetService.createTweet(
        req.userId,
        tweetDto.content,
        mediaUrls,
      );
      const { newTweet, followers } = data;
      await Promise.all(
        followers.map(async (followerId: ObjectId) => {
          // Gửi sự kiện "new_tweet" cho từng người theo dõi
          this.tweetGateway.server.emit('new_tweet', {
            receiverId: followerId.toString(),
            senderId: req.userId,
          });
        }),
      );
      return { success: true, newTweet };
    } catch (error) {
      return { success: false, message: error };
    }
  }
  //UPDATE TWEET
  @Patch('/:id')
  @UseGuards(AuthUserGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'medias', maxCount: 3 }], multerUpload),
  )
  async updateTweet(
    @Param('id') tweetId: string,
    @UploadedFiles() files: any,
    @Body() tweetDto: TweetCreateDto,
    @Req() req: ExtendedRequest,
    @Res() res: Response,
  ) {
    try {
      let mediaUrls: string[] = [];
      if (files && files.medias) {
        mediaUrls = files.medias.map((file: Express.Multer.File) => file.path);
      }
      const tweet = await this.tweetService.updateTweet(
        tweetId,
        tweetDto.content,
        mediaUrls,
      );
      if (!tweet) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: 'Tweet not found' });
      }
      return res
        .status(HttpStatus.OK)
        .json({ success: true, message: 'Updated Tweet successfully', tweet });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error });
    }
  }
  //DELETE TWEET
  @Delete('/:id')
  @UseGuards(AuthUserGuard)
  async deleteTweet(@Param('id') tweetId: string, @Req() req: ExtendedRequest) {
    try {
      const result = await this.tweetService.deleteTweet(tweetId);
      if (!result) {
        return { success: false, message: 'Tweet not found' };
      }
      return { success: true, message: 'Tweet deleted successfully' };
    } catch (error) {
      return { success: false, message: error };
    }
  }

  //GET RELEVANT TWEET WITH CURRENT USER
  @Get('/')
  @UseGuards(AuthUserGuard)
  async getRelevantTweets(@Req() req: ExtendedRequest) {
    try {
      const tweets = await this.tweetService.getRelevantTweets(req.userId);
      return { success: true, tweets };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  //GET ALL TWEETS FOR ADMINPAGE
  @Get('/alltweets')
  async getAllTweets(@Query('page') page: number) {
    try {
      const { tweets, totalPages } = await this.tweetService.getAllTweets(page);
      return { success: true, tweets, totalPages };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  //GET TWEET BY ID TWEET
  @Get('/:id')
  async getTweetById(@Param('id') tweetId: string) {
    try {
      const tweet = await this.tweetService.getTweetById(tweetId);
      return { success: true, tweet };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  //GET TWEET BY ID USER
  @Get('/user/:id')
  async getTweetsByUserId(@Param('id') userId: string) {
    try {
      const tweets = await this.tweetService.getTweetsByUserId(userId);
      return { success: true, tweets };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  //LIKE TWEET
  @Post('/:id/like')
  @UseGuards(AuthUserGuard)
  async likeTweet(@Param('id') tweetId: string, @Req() req: ExtendedRequest) {
    try {
      const likedTweet = await this.tweetService.likeTweet(tweetId, req.userId);
      const tweetAuthorId = likedTweet.author.toString();
      this.tweetGateway.server.emit('commented', {
        receiverId: tweetAuthorId,
        senderId: req.userId,
      });
      return { success: true, likedTweet };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  //UNLIKE TWEET
  @Post('/:id/unlike')
  @UseGuards(AuthUserGuard)
  async unlikeTweet(@Param('id') tweetId: string, @Req() req: ExtendedRequest) {
    try {
      await this.tweetService.unlikeTweet(tweetId, req.userId);
      return { success: true, message: 'Unliked successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  //GET USER LIKE TWEET
  @Get('/:id/likes')
  async getUsersWhoLikedTweet(@Param('id') tweetId: string) {
    try {
      const users = await this.tweetService.getUsersWhoLikedTweet(tweetId);
      return { success: true, users };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  //CREATE COMMENT
  @Post('comments')
  @UseGuards(AuthUserGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 3 }], multerUpload),
  )
  async createComment(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() commentDto: CreateCommentDTO,
    @Req() req: ExtendedRequest,
  ) {
    try {
      let mediaUrls: string[] = [];
      if (files.images) {
        mediaUrls = files.images.map((file) => file.path);
      }
      const newComment = await this.tweetService.createComment(
        req.userId,
        commentDto.content,
        mediaUrls,
        commentDto.parentId,
      );
      const parentComment = await this.tweetService.getTweetById(
        newComment.parentId.toString(),
      );
      const tweetAuthorId = parentComment.author.toString();
      // Gửi thông báo đến người tạo tweet với sự kiện "comment"
      this.tweetGateway.server.emit('commented', {
        receiverId: tweetAuthorId,
        senderId: req.userId,
      });
      return { success: true, newComment };
    } catch (error) {
      return { success: false, message: error };
    }
  }

  //GET COMMENTS BY PARENT ID
  @Get('comments/get-comment/:parentId')
  async getCommentsByParentId(@Param('parentId') parentId: string) {
    try {
      const comments = await this.tweetService.getCommentsByParentId(parentId);
      return { success: true, comments };
    } catch (error) {
      throw new InternalServerErrorException({
        success: false,
        message: error,
      });
    }
  }
}
