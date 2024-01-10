import { Inject, Injectable } from '@nestjs/common';
import { ChatRepositoryInterface } from '../../../../domain/model/chat/ChatRepositoryInterface';
import ChatDtoProvider from '../dtoProvider/ChatDtoProvider';
import {
    PAGINATION_DEFAULT_PAGE,
    PAGINATION_DEFAULT_PER_PAGE,
} from '../../../../../common/application/query/dto/PaginationDtoInterface';
import { ChatCollectionResponseDto } from '../dto/ChatCollectionResponseDto';

@Injectable()
export class ChatCollectionResponseBuilder {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
        private dtoProvider: ChatDtoProvider,
    ) {}

    async build(page?: number, perPage?: number): Promise<ChatCollectionResponseDto> {
        page = page || PAGINATION_DEFAULT_PAGE;
        const take = perPage || PAGINATION_DEFAULT_PER_PAGE;

        const chats = await this.dtoProvider.list(page, take);
        const count = await this.repository.count();

        const meta = {
            pagination: {
                page,
                perPage: take,
                totalItems: count,
            },
        };

        return {
            items: chats,
            meta,
        };
    }
}
