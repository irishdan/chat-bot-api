import { QueryHandler } from '@nestjs/cqrs';
import { ListChatsQuery } from './list-chats.query';
import { CollectionResponseDtoInterface } from '../../../../common/application/query/dto/collection-response-dto.interface';
import { ChatDto } from './dto/chat.dto';
import { ChatCollectionResponseBuilder } from './responseBuilder/chat-collection.response-builder';

@QueryHandler(ListChatsQuery)
export class ListChatsQueryHandler {
    constructor(private responseBuilder: ChatCollectionResponseBuilder) {}

    async execute(query: ListChatsQuery): Promise<CollectionResponseDtoInterface<ChatDto>> {
        return await this.responseBuilder.build(query.page, query.perPage);
    }
}
