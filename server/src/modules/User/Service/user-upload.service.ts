import { Request, Response } from 'express';
import * as multer from 'multer';
import { multerUpload } from 'src/config/multer.config';
import { IUploadedEditUserFiles, IUserUploadResult } from 'src/Types/Types';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UserUploadService {
  async uploadFile(req: Request, res: Response) {
    const upload = multer(multerUpload).fields([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover_photo', maxCount: 1 },
    ]);

    await new Promise<void>((resolve, reject) => {
      upload(req, res, (err: any) => {
        if (err) {
          reject(new Error('Error uploading files.'));
        } else {
          resolve();
        }
      });
    });
    const files = req.files as IUploadedEditUserFiles;
    const result: IUserUploadResult = {};
    if (files.avatar) {
      result['avatarUrl'] = files.avatar[0].path;
    }
    if (files.cover_photo) {
      result['coverPhotoUrl'] = files.cover_photo[0].path;
    }
    return result;
  }
}
