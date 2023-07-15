import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// 싱글톤 패턴으로 Application 구현
class Application {
  private Logger = new Logger(Application.name);

  constructor(private server: NestExpressApplication) {
    this.server = server;
  }

  private async setUpMiddleware() {
    const app = this.server;

    // 요청 본문의 데이터를 변환시키려면 transform옵션을 참값으로 해주어야한다.
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
  }

  async bootstrap() {
    await this.setUpMiddleware();
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
