import { NextFunction, Request, Response } from 'express';

import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

@Injectable()
export class UserValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { username, fullname } = req.body;

    if (username && username.length < 6) {
      throw new BadRequestException('Username must be at least 6 characters');
    }

    if (fullname && fullname.length < 6) {
      throw new BadRequestException('Fullname must be at least 6 characters');
    }

    next();
  }
}
