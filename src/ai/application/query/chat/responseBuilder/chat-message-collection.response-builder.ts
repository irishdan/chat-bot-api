import { Inject, Injectable } from '@nestjs/common';
import {
    PAGINATION_DEFAULT_PAGE,
    PAGINATION_DEFAULT_PER_PAGE,
} from '../../../../../common/application/query/dto/pagination-dto.interface';
import ChatMessageDtoProvider from '../dtoProvider/chat-message.dto-provider';
import ChatDtoProvider from '../dtoProvider/chat.dto-provider';
import { ChatMessageCollectionResponseDto } from '../dto/chat-message-collection.response-dto';
import { ChatRepositoryInterface } from '../../../../domain/model/chat/chat.repository.interface';

@Injectable()
export class ChatMessageCollectionResponseBuilder {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
        private dtoProvider: ChatMessageDtoProvider,
        private chatDtoProvider: ChatDtoProvider,
    ) {}

    async build(chatId: string, page?: number, perPage?: number): Promise<ChatMessageCollectionResponseDto> {
        page = page || PAGINATION_DEFAULT_PAGE;
        const take = perPage || PAGINATION_DEFAULT_PER_PAGE;

        const messages = await this.dtoProvider.list(chatId, page, take);
        const count = await this.repository.countChatMessages(chatId);

        const meta = {
            pagination: {
                page,
                perPage: take,
                totalItems: count,
            },
        };

        const chats = Object.fromEntries(
            await Promise.all(
                messages.map(async (message) => {
                    return this.chatDtoProvider.getById(message.chatId).then((dto) => [dto.id, dto]);
                }),
            ),
        );

        return {
            items: messages,
            meta,
            included: { chats },
        };
    }
}
