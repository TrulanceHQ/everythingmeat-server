/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class VerifiedUserGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ForbiddenException('No token provided');
    }
    try {
      const user = this.jwtService.verify(token);
      request.user = user;

      const dbUser = await this.authService.findUserById(user.sub);
      if (!dbUser.isVerified) {
        throw new ForbiddenException('User is not verified');
      }

      return true;
    } catch (error) {
      throw new ForbiddenException('Access Denied');
    }
  }
}
