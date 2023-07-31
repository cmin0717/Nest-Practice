import { PickType } from '@nestjs/mapped-types';
import { Report } from '../entities/report.entity';

export class CreateReportDto extends PickType(Report, [
  'make',
  'lat',
  'lng',
  'mileage',
  'price',
  'year',
  'model',
] as const) {}
