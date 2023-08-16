import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from 'src/users/auth.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class jwtMiddleWare implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const jwt = req.cookies['jwt'] || undefined;

    if (jwt) {
      req.user = await this.authService.decode(jwt);
    }
    next();
  }
}
