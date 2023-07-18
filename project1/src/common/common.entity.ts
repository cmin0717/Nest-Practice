import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class CommonEntity {
  @IsUUID()
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @CreateDateColumn({ type: 'time' })
  @Expose()
  createDate: string;

  @UpdateDateColumn({ type: 'time' })
  @Expose()
  updateDate: string;

  @DeleteDateColumn({ type: 'time' })
  @Expose()
  deleteDate: string;
}
