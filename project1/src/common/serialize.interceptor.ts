import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

// Serialize의 매개변수의 타입을 정확히 설정하는것은 매우어렵다.
// 그렇기에 컴파일과정에서 최소한의 오류를 잡기위해 클래스타입이 와야한다고 정도로 정의하는것이 최대이다.
interface ClassType {
  new (...args: any[]): any;
}

// 가독성 좋은 코드를 위해 커스텀 데코레이터 생성
export const Serialize = (dto: ClassType) => {
  return UseInterceptors(new serializeInterceptor(dto));
};

export class serializeInterceptor implements NestInterceptor {
  // 해당 인터셉트를 여러 모듈에서 사용하기에 각각의 모듈의 응답에 맞는 dto를 가지고 plaintoclass해야한다.
  // 그렇기에 인터셉트의 인스턴스 생성시 응답에 맞는 dto를 생성자매서드로 생성하고 사용한다.
  constructor(private dto: ClassType) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    return next.handle().pipe(
      map((data: any) => {
        // plainToClass란 첫번째 인자의 클래스의 인스턴스를 두번째인자의 데이터로 생성하여 반환한다.
        // 3번째에는 옵션이 들어가는데 excludePrefixes는 어떤 값을 고정을 뺼건지 정할수있다.
        return {
          success: true,
          data: plainToClass(this.dto, data, { excludeExtraneousValues: true }),
          date: now,
        };
      }),
    );
  }
}
