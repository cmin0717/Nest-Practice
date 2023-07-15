import { Injectable } from '@nestjs/common';
import { PowerService } from 'src/power/power.service';

@Injectable()
export class DiskService {
  constructor(private readonly powerService: PowerService) {}

  getData() {
    console.log('disk Start!');
    this.powerService.supplyPower(20);
    return 'data!';
  }
}
