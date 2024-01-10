import { PaginationDtoInterface } from './PaginationDtoInterface';

export interface CollectionResponseDtoInterface<T> {
    items: T[];
    meta: {
        pagination: PaginationDtoInterface;
    };
}
