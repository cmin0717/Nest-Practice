import { Controller, Get, Param } from '@nestjs/common';
import { CpuService } from 'src/cpu/cpu.service';
import { DiskService } from 'src/disk/disk.service';

@Controller('computer')
export class ComputerController {
  constructor(
    private readonly cpuService: CpuService,
    private readonly diskService: DiskService,
  ) {}

  @Get('/:id')
  run(@Param('id') id: number) {
    return [this.cpuService.compute(id, id), this.diskService.getData()];
  }
}
