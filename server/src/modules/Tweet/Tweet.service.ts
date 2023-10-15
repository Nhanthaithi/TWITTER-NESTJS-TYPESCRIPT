import { Model, ObjectId, Types } from 'mongoose';
import { async } from 'rxjs';
import { ServerOptions } from 'socket.io';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IoAdapter } from '@nestjs/platform-socket.io';

import { Follow } from '../Follow/Schemas/follow.schemas';
import { NotificationService } from '../Notification/notification.service';
import { Tweet, TweetDocument } from './Schemas/tweet.schemas';

@Injectable()
export class TweetService {
  constructor(
    @InjectModel(Tweet.name) private tweetModel: Model<TweetDocument>,
    @InjectModel(Follow.name) private followModel: Model<Follow>,
    private notificationService: NotificationService,
  ) {}
  //CREATE TWEET
  async createTweet(
    author: string,
    content: string,
    mediaUrls: string[],
  ): Promise<any> {
    const tweet = new this.tweetModel({
      content,
      medias: mediaUrls,
      author: new Types.ObjectId(author),
    });
    const followers = await this.followModel.find({
      followed_userId: new Types.ObjectId(author),
    });
    await tweet.save();
    followers.forEach(async (followeId: Follow) => {
      await this.notificationService.create({
        senderId: new Types.ObjectId(author),
        receiverId: followeId.current_userId,
        type: 'new_tweet',
        tweetId: tweet._id, // Loại thông báo
      });
    });

    return { newTweet: tweet, followers };
  }
  //UPDATE TWEET BY TWEET ID
  async updateTweet(
    tweetId: string,
    content: string,
    mediaUrls: string[],
  ): Promise<TweetDocument | { success: boolean; message: string }> {
    const tweet = await this.tweetModel.findById(tweetId);
    if (!tweet) return { success: false, message: 'Tweet not found' };

    if (content) tweet.content = content;
    if (mediaUrls.length > 0) tweet.medias = mediaUrls;
    return tweet.save();
  }
  //DELETE TWEET
  async deleteTweet(tweetId: string): Promise<boolean> {
    const result = await this.tweetModel.findByIdAndDelete(
      new Types.ObjectId(tweetId),
    );
    return !!result;
  }

  //GET ALL RELEVANT TWEETS WITH CURRENT USER
  async getRelevantTweets(userId: string): Promise<TweetDocument[]> {
    const followingRecords = await this.followModel.find({
      current_userId: new Types.ObjectId(userId),
    });
    const followingIds = followingRecords.map(
      (record) => record.followed_userId,
    );
    return this.tweetModel
      .find({
        type: 'tweet',
        $or: [
          { 'likes.length': { $gte: 5 } },
          { author: new Types.ObjectId(userId) },
          { author: { $in: followingIds } },
        ],
      })
      .sort({ createdAt: -1 })
      .populate('author')
      .exec();
  }

  //GET ALL TWEETS FOR ADMINPAGE
  async getAllTweets(
    page: number = 1,
    perPage: number = 10,
  ): Promise<{ tweets: TweetDocument[]; totalPages: number }> {
    const totalTweets = await this.tweetModel.countDocuments();
    const totalPages = Math.ceil(totalTweets / perPage);

    const tweets = await this.tweetModel
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate('author')
      .exec();

    return { tweets, totalPages };
  }
  //GET TWEET BY ID TWEET
  async getTweetById(tweetId: string): Promise<TweetDocument> {
    const tweet = await this.tweetModel
      .findById(tweetId)
      .populate('author')
      .exec();
    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }
    return tweet;
  }
  //GET TWEET BY ID USER
  async getTweetsByUserId(userId: string): Promise<TweetDocument[]> {
    const tweets = await this.tweetModel
      .find({ author: new Types.ObjectId(userId), type: 'tweet' })
      .populate('author')
      .sort({ createdAt: -1 })
      .exec();

    return tweets;
  }
  //ADD LIKE TWEET
  async likeTweet(tweetId: string, userId: string): Promise<TweetDocument> {
    const tweet = await this.tweetModel.findById(tweetId);
    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }
    // Kiểm tra xem người dùng đã like bài tweet này chưa
    if (!tweet.likes.includes(new Types.ObjectId(userId))) {
      tweet.likes.push(new Types.ObjectId(userId));
      await tweet.save();
      // Tạo thông báo cho việc thích tweet
      if (tweet.author.toString() != userId.toString()) {
        await this.notificationService.create({
          senderId: new Types.ObjectId(userId),
          receiverId: tweet.author,
          type: 'like',
          tweetId: tweet._id, // Loại thông báo
        });
      }
    }
    return tweet;
  }
  //UNLIKE TWEET
  async unlikeTweet(tweetId: string, userId: string): Promise<TweetDocument> {
    const tweet = await this.tweetModel.findById(tweetId);
    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }
    const index = tweet.likes.indexOf(new Types.ObjectId(userId));
    if (index !== -1) {
      tweet.likes.splice(index, 1);
      await tweet.save();
    }
    return tweet;
  }
  //GET USER LIKE TWEET
  async getUsersWhoLikedTweet(tweetId: string): Promise<Types.ObjectId[]> {
    const tweet = await this.tweetModel.findById(tweetId).populate('likes');

    if (!tweet) {
      throw new NotFoundException('Tweet not found');
    }
    return tweet.likes;
  }
  //CREATE COMMENT
  async createComment(
    author: string,
    content: string,
    mediaUrls: string[],
    parentId: Types.ObjectId,
  ): Promise<TweetDocument> {
    const parentTweet = await this.tweetModel.findById(parentId);
    const comment = new this.tweetModel({
      content,
      medias: mediaUrls,
      author: new Types.ObjectId(author),
      type: 'comment',
      parentId,
    });
    await comment.save();
    // Tạo thông báo cho việc comment một bài tweet
    if (
      parentTweet &&
      comment.author.toString() != parentTweet.author.toString()
    ) {
      await this.notificationService.create({
        senderId: new Types.ObjectId(author),
        receiverId: parentTweet?.author,
        type: 'comment',
        tweetId: new Types.ObjectId(parentId), // Loại thông báo
      });
    }
    return comment;
  }
  // GET LIST COMMENT OF PARENT TWEET ID
  async getCommentsByParentId(parentId: string): Promise<TweetDocument[]> {
    const listComments = await this.tweetModel
      .find({ type: 'comment', parentId: parentId })
      .populate('author')
      .sort({ createdAt: -1 })
      .exec();
    return listComments;
  }
}
export class CustomIoAdapter extends IoAdapter {
  createIOServer(port: 8000, options?: ServerOptions): any {
    options = {
      ...options,
      cors: {
        origin: ['http://localhost:3000', 'http://localhost:5100'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
    };
    return super.createIOServer(port, options);
  }
}
