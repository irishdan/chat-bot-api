import { PaginationDtoInterface } from './pagination-dto.interface';

export interface CollectionResponseDtoInterface<T> {
    items: T[];
    meta: {
        pagination: PaginationDtoInterface;
    };
}
