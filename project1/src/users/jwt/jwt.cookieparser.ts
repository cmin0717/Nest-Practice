import { HttpException } from '@nestjs/common';
import { Request } from 'express';
import { JwtFromRequestFunction } from 'passport-jwt';

// 요청의 쿠키에서 jwt를 추출하여 리턴한다.
export const jwtExtractorFromCookie: JwtFromRequestFunction = (
  req: Request,
): string | null => {
  try {
    const jwt = req.cookies['jwt'];
    return jwt;
  } catch (error) {
    throw new HttpException('인증 되지 않는 접근입니다.', 401);
  }
};
