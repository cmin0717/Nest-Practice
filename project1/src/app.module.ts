import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Report } from './reports/entities/report.entity';
import { jwtMiddleWare } from './common/jwt.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // 적용할 env파일의 경로입력
      envFilePath: `.env.${process.env.NODE_ENV}`,
      // 환경 변수 유효성 체크
      // validationSchema: Joi.object({
      //   DB_HOST: Joi.string().required(),
      //   DB_USERNAME: Joi.string().required(),
      //   DB_PASSWORD: Joi.string().required(),
      //   DATABASE: Joi.string().required(),
      // }),
    }),
    // mysql 연결
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: process.env.DB_HOST,
    //   port: 3306,
    //   username: process.env.DB_USERNAME,
    //   password: process.env.DB_PASSWORD,
    //   database: process.env.DATABASE,
    //   entities: [],
    //   synchronize: true,
    //   autoLoadEntities: true,
    //   logging: true,
    // }),

    // sqlite 분리전
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.project1',
    //   entities: [User, Report],
    //   autoLoadEntities: true,
    //   synchronize: true,
    //   logging: true,
    // }),

    // sqlite 분리후
    TypeOrmModule.forRootAsync({
      // env파일에 종속성 부여
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          entities: [User, Report],
          autoLoadEntities: true,
          synchronize: true,
          // dropSchema: true,
        };
      },
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(jwtMiddleWare).forRoutes('*');
  // }
}
