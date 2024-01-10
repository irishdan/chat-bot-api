import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import * as Joi from 'joi';
import { AiModule } from './ai/AiModule';
import { CommonModule } from './common/CommonModule';

@Module({
    imports: [
        CacheModule.register<RedisClientOptions>({
            ttl: 60 * 60 * 24 * 365,
            isGlobal: true,
            store: redisStore,
            socket: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT),
            },
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            validationSchema: Joi.object({
                OPENAI_API_KEY: Joi.string(),
                HUGGING_FACE_API_KEY: Joi.string(),
                DATABASE_URL: Joi.string().required(),
                REDIS_HOST: Joi.string().default('localhost').required(),
                REDIS_PORT: Joi.number().default(6379).required(),
            }),
        }),
        EventEmitterModule.forRoot(),
        CommonModule,
        AiModule,
    ],
})
export class AppModule {}
