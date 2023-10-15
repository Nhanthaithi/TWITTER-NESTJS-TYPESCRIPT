import { Request, Response } from 'express';
import { AuthUserGuard } from 'src/Guard/auth.guard';
import { ExtendedRequest } from 'src/Types/Types';

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RevenueService } from '../Revenue/revenue.service';
import { EmailUniqueGuard } from './Guard/EmailUniqueGuard ';
import { UserUpdateInterceptor } from './Interceptor/user-update.interceptor';
import { UserService } from './Service/user.service';
import {
  CreateUserDTO,
  DataLoginDTO,
  UpdateUserDto,
  UpdateUserStatusDto,
  UpdateUserVerifyDto,
} from './UserDTO/user.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(
    private usersService: UserService,
    private revenueService: RevenueService,
  ) {}

  //REGISTER
  @Post()
  @UseGuards(EmailUniqueGuard)
  async createUser(@Body() newUser: CreateUserDTO) {
    return this.usersService.createUser(newUser);
  }
  //LOGIN
  @Post('login')
  async login(@Body() data: DataLoginDTO, @Res() res: Response) {
    const resData = await this.usersService
      .checkLogin(data.email, data.password)
      .then((user) => user?._doc);

    if (!resData) {
      return res.status(404).json({ message: 'Invalid email or password.' });
    }

    const { accessToken, refreshToken, user } =
      await this.usersService.login(resData);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Bạn chỉ nên sử dụng option này khi ứng dụng chạy trên HTTPS
      sameSite: 'none',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set thời gian hết hạn cho cookie = 7 ngày
    });

    return res.status(200).json({ accessToken, user });
  }
  //CREATE NEW ACCESSTOKEN
  @Post('refresh-token')
  async createNewAccessToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const refreshToken = req.cookies.refreshToken; // Lấy refreshToken từ cookie
    try {
      const token = this.usersService.createNewAccessToken(refreshToken);
      // Gửi AccessToken mới trong phản hồi
      const { newAccessToken, newRefreshToken } = token;
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: true, // Bạn chỉ nên sử dụng option này khi ứng dụng chạy trên HTTPS
        sameSite: 'none',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set thời gian hết hạn cho cookie = 7 ngày
      });
      res.status(200).json(newAccessToken);
    } catch (error) {
      // Xử lý lỗi (ví dụ: refreshToken không hợp lệ)
      console.log(error);
      res.status(401).json({ error: error.message });
    }
  }
  //GET ALL USERS
  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      if (limit > 50)
        throw new BadRequestException('Limit should not exceed 50');

      const { users, totalUsers, totalPage } =
        await this.usersService.getAllUsers(page, limit);

      if (page > totalPage && totalPage !== 0) {
        throw new BadRequestException('Page exceeds maximum limit');
      }

      return {
        data: users,
        meta: {
          currentPage: Number(page),
          perPage: limit,
          totalUsers: totalUsers,
          totalPages: totalPage,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'An error occurred while processing your request.',
        );
      }
    }
  }
  //GET USER CURRENT LOGIN
  @Get('current-user')
  @UseGuards(AuthUserGuard)
  async getMe(@Req() request: ExtendedRequest) {
    const user = await this.usersService.findUserById(request.userId);
    return { user }; // Trả về thông tin người dùng sau khi loại bỏ trường password
  }

  //SEARCH USERS BY EMAIL AND USERNAME
  @Get('search')
  @UseGuards(AuthUserGuard)
  async searchUsers(
    @Req() req: ExtendedRequest,
    @Query('query') query: string,
    @Res() res: Response,
  ) {
    if (!query) {
      return res.status(400).json({ message: 'Please enter a keyword' });
    }

    try {
      const users = await this.usersService.searchUsers(query, req.userId);
      return res.status(200).json({ users });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error.' });
    }
  }

  //LOGIN WITH GOOGLE
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('oauth/google')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const { accessToken, refreshToken, user } = req.user;
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true, // Bạn chỉ nên sử dụng option này khi ứng dụng chạy trên HTTPS
      sameSite: 'none',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set thời gian hết hạn cho cookie = 7 ngày
    });
    return res.redirect(`http://localhost:3000?token=${accessToken}`);
    // return res.status(200).json({ accessToken, refreshToken, user });
  }

  //GET USER BY ID
  @Get(':id')
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id);
    return { user };
  }

  // UPDATE USER
  @Patch('update-user')
  @UseInterceptors(UserUpdateInterceptor)
  @UseGuards(AuthUserGuard)
  async updateUser(
    @Req() request: ExtendedRequest,
    @Res() res: Response,
    @Body() updateDataDto: UpdateUserDto,
  ) {
    try {
      const userId = request.userId;

      if (updateDataDto.username && updateDataDto.username.length < 6) {
        throw new Error('Username must be at least 6 characters');
      }
      if (updateDataDto.fullname && updateDataDto.fullname.length < 6) {
        throw new Error('Fullname must be at least 6 characters');
      }
      if (request.body.avatarUrl) {
        updateDataDto.avatar = request.body.avatarUrl;
      }
      if (request.body.coverPhotoUrl) {
        updateDataDto.cover_photo = request.body.coverPhotoUrl;
      }

      const updatedUser = await this.usersService.updateUser(
        userId,
        updateDataDto,
      );
      return res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      return res
        .status(500)
        .json({ message: 'Error updating user.', error: error });
    }
  }
  //UPDATE USER STATUS
  @Patch('/:id/status')
  async updateUserStatus(
    @Req() req: ExtendedRequest,
    @Body() updateUserStatusDto: UpdateUserStatusDto,
    @Param('id') userId: string,
  ) {
    const updatedUser = await this.usersService.updateUserStatus(
      userId,
      updateUserStatusDto.status,
    );
    return { user: updatedUser };
  }
  //UPDATE USER VERIFY
  @Patch('verify')
  @UseGuards(AuthUserGuard)
  async updateUserVerify(
    @Req() req: ExtendedRequest,
    @Body() updateUserVerify: UpdateUserVerifyDto,
  ) {
    const userId = req.userId;
    const updateUser = await this.usersService.updateUserVerify(
      userId,
      updateUserVerify.verify,
    );
    const expirationDate = new Date();
    if (updateUserVerify.verify === 1) {
      expirationDate.setMonth(expirationDate.getMonth() + 1);
    } else if (updateUserVerify.verify === 2) {
      expirationDate.setFullYear(expirationDate.getFullYear() + 50); // Hạn sử dụng là 50 năm
    }
    // Tạo bản ghi "revenue"
    const revenueData = {
      userId: userId, // Thêm ID của người dùng
      expirationDate: expirationDate,
      price: updateUserVerify.price,
    };
    // Gọi service để tạo bản ghi "revenue"
    const revenue = await this.revenueService.createRevenue(revenueData);
    return { user: updateUser, revenue: revenue };
  }
  //LOGOUT
  @Post('logout')
  async logout(@Req() req: any, @Res() res: Response) {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found.' });
    }
    try {
      const result = this.usersService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        return res.status(500).json({ message: error.message });
      }
      return res
        .status(500)
        .json({ message: 'An unexpected error occurred during logout.' });
    }
  }
}
