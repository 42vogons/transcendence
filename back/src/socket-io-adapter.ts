import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { SocketWithAuth } from './types';
const secretJwt = process.env.SECRET_JWT;

export class SocketAdapter extends IoAdapter {
  constructor(private app: INestApplicationContext) {
    super(app);
  }

  createIOServer(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    },
  ) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        credentials: true,
        origin: process.env.FRONT_HOST,
      },
    });
    const jwtService = this.app.get(JwtService);
    console.log('this.app:', this.app);
    server.of('game').use(this.authMiddleware(jwtService));
    server.of('chat').use(this.authMiddleware(jwtService));
    return server;
  }

  authMiddleware =
    (jwtService: JwtService) => (socket: SocketWithAuth, next) => {
      let token = socket.request.headers.cookie;
      token = token?.replace('accessToken=', '');
      try {
        const payload = jwtService.verify(token, { secret: secretJwt });
        socket.userID = payload.id;
        socket.username = payload.login;
        next();
      } catch (e) {
        next(new Error('FORBIDDEN'));
      }
    };
}
