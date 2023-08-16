import { IsBoolean } from 'class-validator';

export class ApproveDTO {
  @IsBoolean()
  approve: boolean;
}
