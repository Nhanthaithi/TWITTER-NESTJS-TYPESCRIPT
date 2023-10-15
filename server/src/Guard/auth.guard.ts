// auth.guard.ts

import * as jwt from 'jsonwebtoken';

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization.split(' ')[1]; // Bearer Token
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN_SECRET || 'Nhana9093@',
      );
      if (typeof decoded === 'object' && decoded !== null) {
        request.userId = decoded.userId;
        request.userRole = decoded.userRole;
      }
      return true;
    } catch (e) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
