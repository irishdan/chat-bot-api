import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CacheHandlerInterface } from '../../../../../common/domain/cache-handler.interface';
import { ChatRepositoryInterface } from '../../../../domain/model/chat/chat.repository.interface';
import { ChatDto } from '../dto/chat.dto';
import ResourceNotFoundException from '../../../../../common/application/exception/resource-not-found.exception';
import EntityNotFoundException from '../../../../../common/domain/exception/entity-not-found.exception';

@Injectable()
export default class ChatDtoProvider {
    constructor(
        @Inject('ChatRepositoryInterface') private repository: ChatRepositoryInterface,
        @Inject('CacheHandlerInterface') private cache: CacheHandlerInterface,
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
            } catch (e: unknown) {
                throw e instanceof EntityNotFoundException ? new ResourceNotFoundException(e.message) : e;
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
