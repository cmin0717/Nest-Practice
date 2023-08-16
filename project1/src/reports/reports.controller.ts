import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { CurrentUserInterceptor } from '../common/current.user.interceptor';
import { JwtAuthGuard } from '../users/jwt/jwt.guard';
import { CurrentUser } from 'src/common/current.user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Serialize } from 'src/common/serialize.interceptor';
import { ReportDto } from './dto/view-report.dto';
import { ApproveDTO } from './dto/approve.dto';
import { AdminGuard } from 'src/common/admin.guard';
import { quaryDTO } from './dto/quary.dto';

@Controller('reports')
@UseInterceptors(CurrentUserInterceptor)
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Serialize(ReportDto)
  create(@Body() createReportDto: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(createReportDto, user);
  }

  @Get()
  quary(@Query() quary: quaryDTO) {
    return this.reportsService.quaryBuilder(quary);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  update(@Param('id') id: string, @Body() body: ApproveDTO) {
    return this.reportsService.changeApprove(id, body.approve);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
