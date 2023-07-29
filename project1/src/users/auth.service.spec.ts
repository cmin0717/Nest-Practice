import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  // 페이크 서비스는 부분적으로 유저 서비스를 구현하기에 Partial를 사용하여 타입을 정의해준다.
  let fakeUserService: Partial<UsersService>;
  let fakeJwtService;
  let fakeConfig;
  // let Users: User[];

  beforeEach(async () => {
    fakeUserService = {
      findOneEmail: () => Promise.resolve(null),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 'uuid', email, password } as User),
    };
    // 아래와 같이 기본 로직을 그대로 구현하여 테스트 진행을 할수도있다.
    // fakeUserService = {
    //   findOneEmail: (email: string) => {
    //     const filterUser = Users.filter((user) => user.email === email);
    //     return Promise.resolve(filterUser[0]);
    //   },
    //   create: (email: string, password: string) => {
    //     const user = {
    //       id: Math.floor(Math.random() * 999).toString(),
    //       email,
    //       password,
    //     } as User;
    //     Users.push(user);
    //     return Promise.resolve(user);
    //   },
    // };
    fakeJwtService = {
      signAsync: jest.fn().mockResolvedValue('jwt-token'),
    };
    fakeConfig = {
      get: jest.fn().mockResolvedValue('secretkey'),
    };

    // 테스트에서 사용할 DI컨테이너를 구축하는것이다.
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        // DI컨테이너에서 해당 공급자의 인스터스를 만들때 useValue에 있는 값을 인스턴스로 만들게된다.
        // 쉽게 말해 해당 공급자 대신에 useValue로 설정한 값을 사용하겠다 라는 의미이다.
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: JwtService,
          useValue: fakeJwtService,
        },
        {
          provide: ConfigModule,
          useValue: fakeConfig,
        },
      ],
    }).compile();

    authService = module.get(AuthService);
  });

  it('test', () => {
    expect(authService).toBeDefined();
  });

  describe('회원가입 테스트', () => {
    it('PassWord의 암호화 테스트', async () => {
      const user = await authService.signUp('test@test.com', 'password');

      expect(user.password).not.toEqual('password');
      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(hash).toBeDefined();
    });

    it('이미 사용중인 이메일 오류 발생', async () => {
      // fake함수를 수정하여 해당 테스트를 진행할수있게 해주어야한다.
      fakeUserService.findOneEmail = () =>
        Promise.resolve({ email: 'test@test.com' } as User);

      // 여러 방법으로 테스트로 에러를 확인하는 방법이있다.
      // 방법 1
      try {
        await authService.signUp('test', 'test');
      } catch (error) {
        expect(error.message).toBe('이미 존재하는 이메일 입니다.');
      }
      // 방법 2
      expect(authService.signUp('test', 'test')).rejects.toThrow(HttpException);
    });
  });

  describe('로그인 테스트', () => {
    it('정보가 없는 이메일로 로그인시 오류발생', async () => {
      await expect(authService.signIn('test', 'test')).rejects.toThrow(
        HttpException,
      );
    });

    it('비밀번호가 일치하지 않을때', async () => {
      fakeUserService.findOneEmail = () =>
        Promise.resolve({ email: 'test@test.com', password: 'test' } as User);

      await expect(authService.signIn('test', 'password')).rejects.toThrow(
        HttpException,
      );
    });

    it('비밀번호가 일치 할 때', async () => {
      fakeUserService.findOneEmail = () =>
        Promise.resolve({
          email: 'test@test.com',
          password:
            '8cb3b81ff9d2ac78.8b38e3e7b045a3ccfbeff43ff1b1a73da6948abf002881baa36e3124d27d166c',
        } as User);

      const user = await authService.signIn('test@test.com', 'password');
      expect(user).toBeDefined();
    });
  });
});
