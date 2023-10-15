import { AuthUserGuard } from 'src/Guard/auth.guard';
import { ExtendedRequest } from 'src/Types/Types';

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { CreateNotificationDto } from './DTO/notification.DTO';
import { NotificationService } from './notification.service';

@Controller('api/v1/notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  @UseGuards(AuthUserGuard)
  async findAll(@Req() req: ExtendedRequest) {
    try {
      const receiverId = req.userId;
      return await this.notificationService.findAll(receiverId);
    } catch (error) {
      return { message: error };
    }
  }
}
