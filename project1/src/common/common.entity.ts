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
  id: string;

  @CreateDateColumn({ type: 'time' })
  createDate: string;

  @UpdateDateColumn({ type: 'time' })
  updateDate: string;

  @DeleteDateColumn({ type: 'time' })
  deleteDate: string;
}
