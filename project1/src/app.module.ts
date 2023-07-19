import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigModule } from '@nestjs/config';
// import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Report } from './reports/entities/report.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 환경 변수 유효성 체크
      // validationSchema: Joi.object({
      //   DB_HOST: Joi.string().required(),
      //   DB_USERNAME: Joi.string().required(),
      //   DB_PASSWORD: Joi.string().required(),
      //   DATABASE: Joi.string().required(),
      // }),
    }),
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
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.project1',
      entities: [User, Report],
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
