import { Request } from 'express';

//Type mở rộng cho Request Check Login
export interface ExtendedRequest extends Request {
  userId?: string;
  userRole?: string;
  avatar?: string;
  cover_photo?: string;
}

export interface IUserUploadResult {
  avatarUrl?: string;
  coverPhotoUrl?: string;
}

export interface IUploadedEditUserFiles {
  avatar?: Express.Multer.File[];
  cover_photo?: Express.Multer.File[];
}

export interface ICloudinaryResponse {
  public_id?: string;
  version?: number;
  signature?: string;
  width?: number;
  height?: number;
  format?: string;
  resource_type?: string;
  url: string;
  secure_url?: string;
  [propName: string]: any;
}
