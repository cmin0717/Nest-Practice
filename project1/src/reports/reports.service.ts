import { HttpException, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { quaryDTO } from './dto/quary.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly repo: Repository<Report>,
  ) {}

  create(createReportDto: CreateReportDto, user: User) {
    try {
      const report = this.repo.create({ ...createReportDto });
      report.user = user;
      return this.repo.save(report);
    } catch (error) {
      throw new HttpException('데이터베이스 오류', 500);
    }
  }

  async changeApprove(id: string, approve: boolean) {
    const report = await this.repo.findOne({ where: { id } });
    if (!report) {
      throw new HttpException('해당 리포트가 없습니다.', 404);
    }
    report.approve = approve;
    return this.repo.save(report);
  }

  quaryBuilder({ make, model, lng, lat, mileage, year }: quaryDTO) {
    return (
      this.repo
        .createQueryBuilder()
        .select('AVG(price)', 'price')
        // 데이터베이스의 make값과 현재 주어진 make값이 같은 데이터만 출력
        .where('make = :make', { make })
        // where사용후에 또 where를 사용하게되면 첫번째 where이 사라지게 된다. 그러므로 andwhere을 사용한다.
        .andWhere('model = :model', { model })
        // 데이터 베이스의 값에서 해당 값을 뺀값이 해당 쿼리사이에 있는값이면 출력한다.라는 의미이다.
        .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
        .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
        .andWhere('year - :year BETWEEN -3 AND 3', { year })
        //orderBy는 2번째 인자로 값을 받는것이 아니기에 따로 setParameters를 사용하여 인자를 넣어주어야한다.
        .orderBy('ABS(mileage - :mileage)', 'DESC')
        .setParameters({ mileage })
        .limit(3)
        .getRawOne()
    );
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
