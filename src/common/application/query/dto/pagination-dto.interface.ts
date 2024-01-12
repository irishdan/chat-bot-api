export const PAGINATION_DEFAULT_PAGE = 1;
export const PAGINATION_DEFAULT_PER_PAGE = 20;

export interface PaginationDtoInterface {
    page: number;
    perPage: number;
    totalItems: number;
}
