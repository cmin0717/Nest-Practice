import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from '../users/users.service';

// 커스텀 데코레이터를 의도에 맞게 사용하기위해 이전에 인터셉트로 미리 밑작업을 해둔다.
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private readonly userService: UsersService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const req: Request = context.switchToHttp().getRequest();
    const userId = req.user;

    // 현재 로그인한 정보가 있다면 req객체의 user에 해당 유저 정보를 DB에서 가져와 넣어둔다.
    if (userId) {
      const user = await this.userService.findOne(userId as string);
      req.user = user;
    }

    // next.handle()는 다음 작업으로 넘긴다는 의미이다
    // 여기서는 작업이 끝났으니 다음 타자가 진행하세요 같은 느낌인것이다.
    return next.handle();
  }
}
