import { Global, Module } from '@nestjs/common';
import CacheHandlerNestJs from './infrastructure/cache/nestjs/CacheHandlerNestJs';
import { PrismaService } from './infrastructure/persistence/prisma/PrismaService';

@Global()
@Module({
    providers: [
        PrismaService,
        {
            provide: 'CacheHandlerInterface',
            useClass: CacheHandlerNestJs,
        },
    ],
    exports: ['CacheHandlerInterface', PrismaService],
})
export class CommonModule {}
