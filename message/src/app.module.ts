import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { PowerModule } from './power/power.module';
import { CpuModule } from './cpu/cpu.module';
import { ComputerModule } from './computer/computer.module';
import { DiskModule } from './disk/disk.module';

@Module({
  imports: [MessagesModule, PowerModule, CpuModule, ComputerModule, DiskModule],
})
export class AppModule {}
