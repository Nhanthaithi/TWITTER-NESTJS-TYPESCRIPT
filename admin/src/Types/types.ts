export interface IUser {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  password?: string;
  status: 0 | 1;
  email_verify_token: string;
  forgot_password_token: string;
  verify: 0 | 1 | 2;
  role: 0 | 1;
  avatar: string;
  cover_photo: string;
}
export interface ITweetLocal {
  _id: string;
  type: string;
  author: IUser;
  content: string;
  parentId?: ITweetLocal | null;
  hashtags?: string[] | null;
  mentions?: string[] | null;
  medias?: string[] | null;
  likes: string[];
  createdAt: string; // Nếu bạn cũng muốn thêm trường này
  updatedAt: string; // Nếu bạn cũng muốn thêm trường này
  __v?: number; // Nếu bạn cũng muốn thêm trường này
}
export interface IRevenue {
  _id: string;
  userId: IUser;
  expirationDate: string;
  price: number;
  createdAt: string;
}
