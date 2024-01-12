import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import AbstractApplicationException from './abstract-application.exception';

@Catch(AbstractApplicationException)
export class ApplicationExceptionFilter implements ExceptionFilter {
    catch(exception: AbstractApplicationException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(exception.code).json({
            statusCode: exception.code,
            message: exception.message,
            error: exception.error,
        });
    }
}
