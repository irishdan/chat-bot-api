import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CacheHandlerInterface } from '../../../../../common/domain/CacheHandlerInterface';
import { ChatMessageDto } from '../dto/ChatMessageDto';
import { ChatRepositoryInterface } from '../../../../domain/model/chat/ChatRepositoryInterface';

@Injectable()
export default class ChatMessageDtoProvider {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
        @Inject('CacheHandlerInterface')
        private cache: CacheHandlerInterface,
    ) {}

    async getById(id: string): Promise<ChatMessageDto> {
        let dto = await this.cache.get<ChatMessageDto>(
            id,
            ChatMessageDto.name,
            ChatMessageDto.version,
            (data: object) => plainToClass(ChatMessageDto, data),
        );

        if (!dto) {
            try {
                const model = await this.repository.findChatMessageById(id);
                dto = model.dto;

                await this.cache.set(dto);
            } catch (e) {
                throw new Error(`ChatMessageDto with id ${id} not found`);
            }
        }

        return dto;
    }
    async getByIds(ids: string[]): Promise<ChatMessageDto[]> {
        return await Promise.all(ids.map((id) => this.getById(id)));
    }

    async getByPromptMessageId(id: string): Promise<ChatMessageDto | null> {
        const messageId = await this.repository.findChatMessageIdByPromptMessageId(id);
        return messageId ? await this.getById(messageId) : null;
    }

    async list(
        chatId: string,
        page?: number,
        perPage?: number,
        sort: 'desc' | 'asc' = 'desc',
    ): Promise<ChatMessageDto[]> {
        const ids = await this.repository.listChatMessageIds(chatId, page, perPage, sort);
        return await this.getByIds(ids);
    }
}
