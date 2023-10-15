import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Revenue } from './Schema/revenue.schema';

@Injectable()
export class RevenueService {
  constructor(
    @InjectModel(Revenue.name) private revenueModel: Model<Revenue>,
  ) {}

  //CREATE REVENUE VERIFY
  async createRevenue(createRevenueDto: any) {
    const revenue = new this.revenueModel(createRevenueDto);
    await revenue.save();
    return revenue;
  }
  // GET ALL REVENUE
  async getAllRevenueWithUserVerification() {
    try {
      const revenues = await this.revenueModel
        .find()
        .populate('userId')
        .sort({ createdAt: -1 }) // Populate thông tin từ bảng user (name và verified)
        .exec();

      return revenues;
    } catch (error) {
      throw new Error(`Failed to fetch revenue data: ${error}`);
    }
  }
}
