import { rm } from 'fs/promises';
import { join } from 'path';

global.beforeEach(async () => {
  const filepath = join(__dirname, '..', 'db.test');
  try {
    await rm(filepath);
  } catch (error) {}
});
