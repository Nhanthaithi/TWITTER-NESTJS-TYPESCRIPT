import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Model, Types } from 'mongoose';
import {
  BlockedUser,
  BlockedUserDocument,
} from 'src/modules/BlockedUser/schema/BlockedUser.schema';

import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User } from '../schemas/user.schema';
import { CreateUserDTO, LoginUserDTO } from '../UserDTO/user.dto';
import { MailService } from './nodemailer.service';

const JWT_ACCESS_TOKEN_KEY =
  process.env.JWT_ACCESS_TOKEN_SECRET || 'Nhana9093@';
const JWT_REFRESH_TOKEN_KEY =
  process.env.JWT_REFRESH_TOKEN_SECRET || 'Nhana9093@';

@Injectable()
export class UserService {
  private refreshTokens: string[] = [];
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(BlockedUser.name)
    private blockedUserModel: Model<BlockedUserDocument>,
    private mailService: MailService,
  ) {}

  //CHECK EMAIL IS EXISTENT
  async isEmailUnique(email: string): Promise<boolean> {
    const user = await this.userModel.findOne({ email });
    return !user;
  }

  //REGISTER
  async createUser(user: CreateUserDTO): Promise<{ message: string }> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      user.password = hashedPassword;
      user.type_login = 1;
      const newUser = new this.userModel(user);
      newUser.save();
      await this.mailService.sendRegistrationEmail(newUser);
      return { message: 'User created successfully' };
    } catch (error) {
      return error;
    }
  }

  //CHECK EMAIL PASSWORD
  async checkLogin(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  //LOGIN
  async login(user: LoginUserDTO) {
    const payload = { userRole: user.role, userId: user._id };
    const accessToken = this.getAccessToken(payload);
    const refreshToken = this.getRefreshToken(payload);
    this.storeRefreshToken(refreshToken);
    // const responseUser = classToPlain(user);
    const { password, ...responseUser } = user;
    return {
      accessToken,
      refreshToken,
      user: responseUser,
    };
  }
  getAccessToken(payload: any): string {
    return jwt.sign(payload, JWT_ACCESS_TOKEN_KEY, { expiresIn: '2d' });
  }
  getRefreshToken(payload: any): string {
    return jwt.sign(payload, JWT_REFRESH_TOKEN_KEY, { expiresIn: '7d' });
  }

  //LƯU VÀO MẢNG REFRESH TOKEN
  storeRefreshToken(token: string) {
    this.refreshTokens.push(token);
  }

  //XÓA REFRESH TOKEN
  removeRefreshToken(token: string) {
    this.refreshTokens = this.refreshTokens.filter((t) => t !== token);
  }

  //CHECK REFRESH TOKEN
  isRefreshTokenValid(token: string): boolean {
    return this.refreshTokens.includes(token);
  }
  //CREATE NEW ACCESSTOKEN
  createNewAccessToken(refreshToken: string): {
    newAccessToken: string;
    newRefreshToken: string;
  } {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found.');
    }
    if (!this.isRefreshTokenValid(refreshToken)) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    const decodedRefreshToken: any = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET,
    );

    const payload = {
      userId: decodedRefreshToken.userId,
      userRole: decodedRefreshToken.userRole,
    };

    const newAccessToken = this.getAccessToken(payload);
    const newRefreshToken = this.getRefreshToken(payload);

    this.storeRefreshToken(newRefreshToken);
    this.removeRefreshToken(refreshToken); // Xóa Refresh Token cũ trong mảng

    return { newAccessToken, newRefreshToken };
  }

  // GET ALL USERS
  async getAllUsers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: User[]; totalUsers: number; totalPage: number }> {
    try {
      const skip = (page - 1) * limit;

      const totalUsers = await this.userModel.countDocuments().exec();
      const users = await this.userModel
        .find({ role: 0 })
        .skip(skip)
        .limit(limit)
        .exec();
      const totalPage = Math.ceil(totalUsers / limit);

      return { users, totalUsers, totalPage };
    } catch (error) {
      throw new Error('Error fetching users.');
    }
  }

  // GET USER BY ID
  async findUserById(userId: string): Promise<Partial<User>> {
    // const id = new Types.ObjectId(userId);
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new Error('User not found.');
      }
      const { password, ...resUser } = user.toObject();
      return resUser;
    } catch (error) {
      throw error;
    }
  }

  //UPDATE USER INFO
  async updateUser(userId: string, updateData: any): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    // console.log(updateData);

    // Cập nhật các trường của người dùng nếu chúng được cung cấp
    if (updateData.username) {
      user.username = updateData.username;
    }

    if (updateData.fullname) {
      user.fullname = updateData.fullname;
    }

    if (updateData.avatar) {
      user.avatar = updateData.avatar;
    }

    if (updateData.cover_photo) {
      user.cover_photo = updateData.cover_photo;
    }

    // Lưu lại người dùng và trả về
    await user.save();
    return user;
  }
  //SEARCH USER
  async searchUsers(
    query: string,
    userId_current: string,
  ): Promise<Partial<User>[]> {
    const blockedByCurrentUser = await this.blockedUserModel
      .find({ userId_current: new Types.ObjectId(userId_current) })
      .exec();
    const blockedCurrentUser = await this.blockedUserModel.find({
      blockedUserId: new Types.ObjectId(userId_current),
    });
    const blockedUserIds = [
      ...new Set([
        ...blockedByCurrentUser.map((u) => u.blockedUserId),
        ...blockedCurrentUser.map((u) => u.userId_current),
      ]),
    ];
    const users = await this.userModel
      .find({
        $and: [
          {
            $or: [
              { email: { $regex: query, $options: 'i' } },
              { username: { $regex: query, $options: 'i' } },
            ],
          },
          { _id: { $nin: blockedUserIds } },
        ],
      })
      .exec();

    return users.map((user) => {
      const { password, ...rest } = user.toObject();
      return rest;
    });
  }
  //GOOGLE VALIDATE
  async validateOAuthLogin(profile: any): Promise<any> {
    const user = await this.userModel.findOne({
      email: profile.emails[0].value,
    });
    if (user) {
      if (user.type_login === 1) {
        throw new Error('User has already registered with a regular email.');
      } else {
        return {
          accessToken: this.getAccessToken({
            userId: user._id,
            userRole: user.role,
          }),
          refreshToken: this.getRefreshToken({
            userId: user._id,
            userRole: user.role,
          }),
          user,
        };
      }
    } else {
      const avatarUrrl =
        profile.photos.length > 0 ? profile.photos[0].value : '';
      const newUser = new this.userModel({
        email: profile.emails[0].value,
        username: profile.displayName.replace(/\s+/g, ''),
        fullname: profile.displayName,
        password: '',
        type_login: 2,
        avatar: avatarUrrl && avatarUrrl,
      });
      await newUser.save();
      return {
        accessToken: this.getAccessToken({
          userId: newUser._id,
          userRole: newUser.role,
        }),
        refreshToken: this.getRefreshToken({
          userId: newUser._id,
          userRole: newUser.role,
        }),
        user: newUser,
      };
    }
  }
  //UPDATE USER STATUS
  async updateUserStatus(userId: string, status: number): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.status = status;
    return user.save();
  }
  //UPDATE USER VERIFY
  async updateUserVerify(userId: string, verify: number): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.verify = verify;
    return user.save();
  }
  //LOGOUT
  logout(refreshToken: string): { message: string } {
    this.removeRefreshToken(refreshToken);
    return { message: 'Logout successfully' };
  }
}
