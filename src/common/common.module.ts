import { Global, Module } from '@nestjs/common';
import CacheHandlerNestJs from './infrastructure/cache/nestjs/cache-handler.nest-js';
import { PrismaService } from './infrastructure/persistence/prisma/prisma.service';
import { ApplicationExceptionFilter } from './application/exception/application-exception.filter';

@Global()
@Module({
    providers: [
        ApplicationExceptionFilter,
        PrismaService,
        {
            provide: 'CacheHandlerInterface',
            useClass: CacheHandlerNestJs,
        },
    ],
    exports: ['CacheHandlerInterface', PrismaService],
})
export class CommonModule {}
