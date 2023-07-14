import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { createMessageDTO } from './dtos/createMessages.dto';

@Controller('messages')
export class MessagesController {
  @Get()
  listMessages() {
    return 'Hello World';
  }

  @Post()
  createMessages(@Body() body: createMessageDTO) {
    return body.transform();
  }

  @Get('/:id')
  getMessages(@Param('id') id: string) {
    return id;
  }
}
