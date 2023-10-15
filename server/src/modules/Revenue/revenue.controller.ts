import { Body, Controller, Get, Post } from '@nestjs/common';

import { CreateRevenueDto } from './DTO/revenue.dto';
import { RevenueService } from './revenue.service';

@Controller('api/v1/revenues')
export class RevenueController {
  constructor(private revenueService: RevenueService) {}

  @Post()
  createRevenue(@Body() createRevenueDto: CreateRevenueDto) {
    return this.revenueService.createRevenue(createRevenueDto);
  }

  //GET ALL REVENUE
  @Get()
  async getAllRevenueWithUserVerification() {
    try {
      const revenuesWithUsers =
        await this.revenueService.getAllRevenueWithUserVerification();
      return revenuesWithUsers;
    } catch (error) {
      throw new Error(`Failed to fetch revenue data: ${error.message}`);
    }
  }
}
