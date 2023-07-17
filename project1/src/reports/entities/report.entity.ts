import { Entity, Column } from 'typeorm';
import { CommonEntity } from 'src/common/common.entity';

@Entity({ name: 'Report' })
export class Report extends CommonEntity {
  @Column({ type: 'int' })
  price: number;
}
