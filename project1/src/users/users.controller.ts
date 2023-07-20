import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  HttpException,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from 'src/common/serialize.interceptor';
import { UserDto } from './dto/view-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { CurrentUser } from 'src/common/current.user.decorator';
import { CurrentUserInterceptor } from 'src/common/current.user.interceptor';
import { User } from './entities/user.entity';

// @UseInterceptors(new serializeInterceptor(UserDto))
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() body: CreateUserDto) {
    return this.authService.signUp(body.email, body.password);
  }

  @Post('/login')
  login(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.signIn(body.email, body.password, res);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  currentUser(@CurrentUser() user: User) {
    console.log(user);
    return user;
  }

  @Get('/all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(id, body);
  }

  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    try {
      res.clearCookie('jwt');
    } catch (error) {
      throw new HttpException('로그아웃 실패', 400);
    }
    return '로그아웃 완료!';
  }
}
