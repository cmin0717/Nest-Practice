import { Injectable } from '@nestjs/common';
import { MessageRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(private readonly messageRepo: MessageRepository) {}

  findOen(id: string) {
    return this.messageRepo.findOne(id);
  }

  findAll() {
    return this.messageRepo.findAll();
  }

  create(message: string) {
    return this.messageRepo.create(message);
  }
}
