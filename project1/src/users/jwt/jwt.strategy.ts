import { HttpException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users.service';
import { jwtExtractorFromCookie } from './jwt.cookieparser';

interface Payload {
  id: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersService) {
    super({
      // jwt 추출 방법
      jwtFromRequest: ExtractJwt.fromExtractors([jwtExtractorFromCookie]),
      // jwt 서명 키
      secretOrKey: process.env.SECRET_KEY,
      // 만료된 토큰을 어떻게 처리할지 (false이면 만료된 토큰일 경우 에러 발생)
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    const user = await this.usersRepository.findOne(payload.id);

    if (user) {
      return user;
    } else {
      throw new HttpException('접근 오류!', 400);
    }
  }
}
