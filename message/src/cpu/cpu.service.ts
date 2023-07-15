import { Injectable } from '@nestjs/common';
import { PowerService } from 'src/power/power.service';

@Injectable()
export class CpuService {
  constructor(private readonly powerService: PowerService) {}

  compute(a: number, b: number) {
    console.log('cpu called!');
    this.powerService.supplyPower(a + b);
    return a + b;
  }
}
