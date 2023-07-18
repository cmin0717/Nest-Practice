import { CommonEntity } from 'src/common/common.entity';
import { Entity, Column, AfterInsert, AfterUpdate, AfterRemove } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Entity({ name: 'User' })
export class User extends CommonEntity {
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요' })
  @IsNotEmpty({ message: '값을 입력해주쇼' })
  @Column({ type: 'varchar', nullable: false })
  @Expose()
  email: string;

  @IsNotEmpty({ message: '값을 입력해주쇼' })
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @AfterInsert()
  afterInsert() {
    console.log('생성되었습니다!');
  }

  @AfterUpdate()
  afterUpdate() {
    console.log('업데이트 되었슴당');
  }

  @AfterRemove()
  afterRemove() {
    console.log('삭제 되었습니다.');
  }
}
