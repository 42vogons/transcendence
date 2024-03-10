import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

const secretJwt = process.env.SECRET_JWT;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: secretJwt, // Certifique-se de que 'secretJwt' é a sua chave secreta real
      });
      request['user'] = payload;
      if (payload.action === 'logged') return true;
    } catch {
      throw new UnauthorizedException();
    }
    return false;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    const token = request.cookies['accessToken'];
    if (token) {
      return token;
    }
    return undefined; //request.headers.cookie['accessToken'];
  }
}
