import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ApplicationExceptionFilter } from './common/application/exception/application-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );
    app.useGlobalFilters(new ApplicationExceptionFilter());
    app.enableCors();
    await app.listen(3000);
}
bootstrap();
