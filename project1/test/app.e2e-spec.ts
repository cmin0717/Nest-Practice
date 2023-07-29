import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setUpMiddleware } from '../src/main';
import { NestExpressApplication } from '@nestjs/platform-express';

describe('AppController (e2e)', () => {
  let app: NestExpressApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await setUpMiddleware(app);
    await app.init();
  });

  describe('Auth', () => {
    const email = 'test@test.com';

    it('회원가입', async () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email, password: 'password' })
        .expect(201)
        .then((res) => {
          const { id, email } = res.body.data;
          expect(id).toBeDefined();
          expect(email).toEqual('test@test.com');
        });
    });

    it('중복된 이메일', async () => {
      return request(app.getHttpServer())
        .post('/users')
        .send({ email, password: 'password' })
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe('이미 존재하는 이메일 입니다.');
        });
    });

    it('정상 로그인', async () => {
      const res = await request(app.getHttpServer())
        .post('/users/login')
        .send({ email, password: 'password' })
        .expect(201);
      const cookie = res.get('Set-Cookie');

      const { body } = await request(app.getHttpServer())
        .get('/users')
        .set('Cookie', cookie)
        .expect(200);

      expect(body.data.email).toEqual('test@test.com');
    });
  });
});
