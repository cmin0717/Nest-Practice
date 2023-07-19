import {
  ExecutionContext,
  HttpException,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    if (req.user) return req.user;
    throw new HttpException('인증 되지 않는 접근입니다.', 401);
  },
);
