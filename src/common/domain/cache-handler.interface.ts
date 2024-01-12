import DtoInterface from '../application/query/dto/dto.interface';

export interface CacheHandlerInterface {
    delete(id: string, className: string, version: number): void;
    get<T extends object>(
        id: string,
        className: string,
        version: number,
        transformer?: (data: object) => T,
    ): Promise<T | null>;
    set(dto: DtoInterface, ttl?: number): Promise<void>;
}
