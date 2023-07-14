import { IsString } from 'class-validator';

export class createMessageDTO {
  @IsString({ message: '문자열로 입력해주쇼' })
  content: string;

  // 이런식으로 데이터를 변화할수있는 메서드를 DTO에 넣어줄수있다.
  transform() {
    return this.content + 'hello';
  }
}
