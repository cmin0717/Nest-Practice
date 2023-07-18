import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  create(email: string, password: string) {
    const user = this.userRepo.create({ email, password });

    return this.userRepo.save(user);
  }

  findAll() {
    return this.userRepo.find();
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('해당 유저가 없습니다.');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // save를 이용한 update
    const user = await this.findOne(id);
    // Object.assign() : 첫번쨰 인자에 두번째인자를 덮는다.
    Object.assign(user, updateUserDto);
    return this.userRepo.save(user);

    // update를 이용한 update
    await this.userRepo.update({ id }, { ...updateUserDto });
    return updateUserDto;
  }

  async remove(id: string) {
    // remove를 이용한 삭제(Entity 사용)
    const user = await this.findOne(id);
    return this.userRepo.remove(user);

    // delete를 이용한 삭제 (특정 컬럼 사용)
    // return this.userRepo.delete({ id });

    // softdelete를 이용한 논리적 삭제 (특정 컬럼 사용)
    return this.userRepo.softDelete({ id });
    this.userRepo.restore({ id }); // Repository의 restore메서드를 통해 논리적 삭제를 복구 할 수 있다.
  }
}
