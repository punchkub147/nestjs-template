import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const client = request.headers['user-agent'];
    const { method, url } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const time = Date.now() - now;
        const date = new Date().toLocaleString();
        console.log(`${date} ${client} ${method} ${url} ${time}ms`);
      }),
    );
  }
}
