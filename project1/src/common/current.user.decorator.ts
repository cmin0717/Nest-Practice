import {
  ExecutionContext,
  HttpException,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  // 매개변수 data는 해당 커스텀 데콜레이터의 인자로 넣어준값이 들어온다.
  (data: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    if (req.user) return req.user;
    throw new HttpException('인증 되지 않는 접근입니다.', 401);
  },
);
