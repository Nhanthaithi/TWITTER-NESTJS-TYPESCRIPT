import { Types } from 'mongoose';

export class CreateRevenueDto {
  userId: Types.ObjectId;
  expirationDate: Date | string;
  price: number;
}
