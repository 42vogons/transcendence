import { INestApplicationContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions, Socket } from 'socket.io';

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
    // const jwtService = this.app.get(JwtService);
    // server.use(createTokenMiddleware, jwtService);
    return server;
  }
}

// export const createTokenMiddleware =
//   (jwtService: JwtService) =>
//   (socket: Socket & { id: number; login: string }, next) => {
//     // for Postman testing support, fallback to token header
//     const token = socket.request.headers.cookie;
//     console.log('----token :', token);

//     try {
//       const payload = jwtService.verify(token);
//       // socket.id = payload.sub;
//       socket.login = payload.login;
//       // socket.name = payload.name;
//       next();
//     } catch {
//       next(new Error('FORBIDDEN'));
//     }
//   };

// const request = context.switchToHttp().getRequest<Request>();
//   const token = this.extractTokenFromCookie(request);
//   if (!token) {
//     throw new UnauthorizedException();
//   }
//   try {
//     const payload = await this.jwtService.verifyAsync(token, {
//       secret: secretJwt, // Certifique-se de que 'secretJwt' é a sua chave secreta real
//     });
//     request['user'] = payload;
//   } catch {
//     throw new UnauthorizedException();
//   }
//   return true;
// }

// extractTokenFromCookie(request: Request): string | undefined {
//     const token = request.cookies['accessToken'];
//     if (token) {
//       return token;
//     }
//     return request.headers.cookie['accessToken'];
//   }
