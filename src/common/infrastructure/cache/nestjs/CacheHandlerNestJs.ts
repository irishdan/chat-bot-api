import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheHandlerInterface } from '../../../domain/CacheHandlerInterface';
import DtoInterface from '../../../application/query/dto/DtoInterface';

@Injectable()
class CacheHandlerNestJs implements CacheHandlerInterface {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    delete(id: string, className: string, version: number): void {
        const key = this.getKey(id, className, version);
        this.cacheManager.del(key);
    }

    async get<T extends object>(
        id: string,
        className: string,
        version: number,
        transformer?: (data: object) => T,
    ): Promise<T | null> {
        const key = this.getKey(id, className, version);
        const data = await this.cacheManager.get<object | null>(key);

        if (data && transformer) {
            return transformer(data);
        }

        return data as T | null;
    }

    async set(dto: DtoInterface): Promise<void> {
        const key = this.getKey(dto.getId(), dto.constructor.name, dto.getVersion());
        await this.cacheManager.set(key, dto);
    }

    private getKey(id: string, className: string, version: number): string {
        return `${className}:${version}:${id}`;
    }
}

export default CacheHandlerNestJs;
