import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as passPort from 'passport';
import * as expressSession from 'express-session';
import * as cookieParser from 'cookie-parser';

export const setUpMiddleware = async (app: NestExpressApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, whitelist: true }),
    // whitelist옵션 : 내가의도한 DTO값만 사용하게된다. DTO을 충족하지만 더 많은 정보를 줄 경우에 DTO에 있는 정보만 사용하게 된다.
  );

  app.use(cookieParser());
  app.use(
    expressSession({
      secret: process.env.SECRET_KEY,
      resave: true,
      saveUninitialized: true,
    }),
  );

  app.use(passPort.initialize());
  app.use(passPort.session());
};

// 싱글톤 패턴으로 Application 구현
class Application {
  private Logger = new Logger(Application.name);

  constructor(private server: NestExpressApplication) {
    this.server = server;
  }

  // private async setUpMiddleware() {
  //   const app = this.server;

  //   // 요청 본문의 데이터를 변환시키려면 transform옵션을 참값으로 해주어야한다.
  //   app.useGlobalPipes(
  //     new ValidationPipe({ transform: true, whitelist: true }),
  //     // whitelist옵션 : 내가의도한 DTO값만 사용하게된다. DTO을 충족하지만 더 많은 정보를 줄 경우에 DTO에 있는 정보만 사용하게 된다.
  //   );

  //   app.use(cookieParser());
  //   app.use(
  //     expressSession({
  //       secret: process.env.SECRET_KEY,
  //       resave: true,
  //       saveUninitialized: true,
  //     }),
  //   );

  //   app.use(passPort.initialize());
  //   app.use(passPort.session());
  // }

  async bootstrap() {
    await setUpMiddleware(this.server);
    await this.server.listen(8000);
    this.LogStart();
  }

  private LogStart() {
    this.Logger.log('Start Server!');
  }
}

const init = async () => {
  const server = await NestFactory.create<NestExpressApplication>(AppModule);
  const app = new Application(server);
  await app.bootstrap();
};
init().catch((e) => {
  new Logger('init', e);
});
