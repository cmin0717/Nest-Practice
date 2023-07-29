import { HttpException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

// promisify매서드는 콜백함수로 처리해야할 함수를 프로미스 함수로 처리할수있게 해주는 매서드이다.
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string) {
    try {
      const user = await this.userService.findOneEmail(email);
      if (user.email) {
        throw new HttpException('이미 존재하는 이메일 입니다.', 400);
      }

      // 8바이트의 랜덤수를 16진수로 변환한 값을 salt로 설정한다.
      const salt = randomBytes(8).toString('hex');

      // hash의 타입이 buffer라는것을 TS에게 알려준다.
      // scrypt의 첫번째인자는 해쉬할값, 두번째는 salt값, 세번째는 해쉬값의 길이를 매개변수로 갖는다.
      const hash = (await scrypt(password, salt, 32)) as Buffer;

      const result = salt + '.' + hash.toString('hex');

      return this.userService.create(email, result);
    } catch (error) {
      throw error;
    }
  }

  async signIn(email: string, password: string, res?: Response) {
    try {
      const user = await this.userService.findOneEmail(email);

      if (!user.email) {
        throw new HttpException('해당 가입정보가 없습니다.', 400);
      }

      const [salt, hash] = user.password.split('.');
      const newhash = (await scrypt(password, salt, 32)) as Buffer;

      if (newhash.toString('hex') !== hash) {
        throw new HttpException('비밀번호가 일치하지 않습니다.', 400);
      }

      const jwt = await this.jwtService.signAsync(
        { id: user.id },
        { secret: process.env.SECRET_KEY },
      );

      if (res) {
        res.cookie('jwt', jwt, { httpOnly: true });
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}
