import { Transform } from 'class-transformer';
import {
  IsNumber,
  IsString,
  Max,
  Min,
  IsLongitude,
  IsLatitude,
} from 'class-validator';

export class quaryDTO {
  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: '숫자를 입력해주세요' })
  @Min(0, { message: '양수를 입력해주세요' })
  @Max(1000000, { message: '최댓값을 넘어간 수 입니다.' })
  price: number;

  @IsString({ message: '제조사를 정확히 입력해주세여' })
  make: string;

  @IsString({ message: '모델명을 입력해주세요' })
  model: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: '올바른 연식을 입력해주세요' })
  @Min(1930)
  @Max(2024)
  year: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLongitude({ message: '올바른 경도를 입력해주세요' })
  lng: number;

  @Transform(({ value }) => parseFloat(value))
  @IsLatitude({ message: '올바른 위도를 입력해주세요' })
  lat: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber({}, { message: '올바른 주행거리가 아닙니다.' })
  @Min(0)
  @Max(4000000)
  mileage: number;
}
