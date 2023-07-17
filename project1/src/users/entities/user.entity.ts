import { CommonEntity } from 'src/common/common.entity';
import { Entity, Column, AfterInsert } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity({ name: 'User' })
export class User extends CommonEntity {
  @IsEmail({}, { message: '올바른 이메일을 작성해주세요' })
  @IsNotEmpty({ message: '값을 입력해주쇼' })
  @Column({ type: 'varchar', nullable: false })
  email: string;

  @IsNotEmpty({ message: '값을 입력해주쇼' })
  @Column({ type: 'varchar', nullable: false })
  password: string;

  @AfterInsert()
  afterInsert() {
    console.log('생성되었습니다!');
  }
}
