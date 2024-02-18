import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { isPrismaError } from '../utils/is-prisma-error.util';
import { handleDatabaseErrors } from '../utils/handle-database-errors.util';
import { DatabaseError } from '../types/DatabaseError';

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (error.code === 'P2025' || error.code === 'P2003') {
          throw new NotFoundException('Record not found.');
        }
        Logger.error('code error' + error.code);
        if (isPrismaError(error)) {
          error = handleDatabaseErrors(error);
        }
        if (error instanceof DatabaseError) {
          Logger.error('error' + error.message);
          throw new BadRequestException(error.message);
        } else {
          throw error;
        }
      }),
    );
  }
}
