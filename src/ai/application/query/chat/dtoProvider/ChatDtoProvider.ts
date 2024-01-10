import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CacheHandlerInterface } from '../../../../../common/domain/CacheHandlerInterface';
import { ChatRepositoryInterface } from '../../../../domain/model/chat/ChatRepositoryInterface';
import { ChatDto } from '../dto/ChatDto';

@Injectable()
export default class ChatDtoProvider {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
        @Inject('CacheHandlerInterface')
        private cache: CacheHandlerInterface,
    ) {}

    async getById(id: string): Promise<ChatDto> {
        let dto = await this.cache.get<ChatDto>(id, ChatDto.name, ChatDto.version, (data: object) =>
            plainToClass(ChatDto, data),
        );

        if (!dto) {
            try {
                const model = await this.repository.findById(id);
                dto = model.dto;

                await this.cache.set(dto);
            } catch (e) {
                throw new Error(`ChatDto with id ${id} not found`);
            }
        }

        return dto;
    }
    async getByIds(ids: string[]): Promise<ChatDto[]> {
        return await Promise.all(ids.map((id) => this.getById(id)));
    }

    async list(page?: number, perPage?: number): Promise<ChatDto[]> {
        const ids = await this.repository.listIds(page, perPage);
        return await this.getByIds(ids);
    }
}
