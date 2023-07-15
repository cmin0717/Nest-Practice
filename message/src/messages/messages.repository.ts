import { Injectable } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class MessageRepository {
  async findOne(id: string) {
    const messages = await readFile('messages.json', 'utf-8');

    const content = JSON.parse(messages);

    return content[id];
  }

  async findAll() {
    const messages = await readFile('messages.json', 'utf-8');

    const content = JSON.parse(messages);

    return content;
  }

  async create(message: string) {
    const messages = await readFile('messages.json', 'utf-8');

    const content = JSON.parse(messages);

    const id = Math.floor(Math.random() * 999);
    content[id] = { id, content: message };

    await writeFile('messages.json', JSON.stringify(content));
  }
}
