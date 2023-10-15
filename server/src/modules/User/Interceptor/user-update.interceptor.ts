import * as multer from 'multer';
import { Observable } from 'rxjs';
import { multerUpload } from 'src/config/multer.config';

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class UserUpdateInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const body = req.body;

    const { username, fullname } = body;

    if (username && username.length < 6) {
      throw new Error('Username must be at least 6 characters');
    }
    if (fullname && fullname.length < 6) {
      throw new Error('Fullname must be at least 6 characters');
    }

    const upload = multer(multerUpload).fields([
      { name: 'avatar', maxCount: 1 },
      { name: 'cover_photo', maxCount: 1 },
    ]);

    await new Promise<void>((resolve, reject) => {
      upload(req, context.switchToHttp().getResponse(), (err: any) => {
        if (err) {
          reject(new Error('Error uploading files.'));
        } else {
          if (req.files) {
            if (req.files.avatar) {
              req.body.avatarUrl = req.files.avatar[0].path; // cloudinary URL
            }

            if (req.files.cover_photo) {
              req.body.coverPhotoUrl = req.files.cover_photo[0].path; // cloudinary URL
            }
          }
          resolve();
        }
      });
    });
    return next.handle();
  }
}
