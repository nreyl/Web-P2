import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch(HttpException)
export class MensajesFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const res = http.getResponse<Response>();
    const req = http.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 403) {
      return res
        .status(status)
        .json({ statusCode: status, error: 'Forbidden', message: 'No autorizado' });
    }
    // Las rutas de /auth son públicas: un 401 allí es de login o refresh, no del guard.
    if (status === 401 && !req.path.startsWith('/auth/')) {
      return res
        .status(status)
        .json({ statusCode: status, error: 'Unauthorized', message: 'Token inválido o faltante' });
    }
    const body = exception.getResponse();
    return res.status(status).json(typeof body === 'string' ? { statusCode: status, message: body } : body);
  }
}
