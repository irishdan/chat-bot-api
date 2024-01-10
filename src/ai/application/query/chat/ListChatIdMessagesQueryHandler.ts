import { QueryHandler } from '@nestjs/cqrs';
import { CollectionResponseDtoInterface } from '../../../../common/application/query/dto/CollectionResponseDtoInterface';
import { ListChatIdMessagesQuery } from './ListChatIdMessagesQuery';
import { ChatMessageDto } from './dto/ChatMessageDto';
import { ChatMessageCollectionResponseBuilder } from './responseBuilder/ChatMessageCollectionResponseBuilder';

@QueryHandler(ListChatIdMessagesQuery)
export class ListChatIdMessagesQueryHandler {
    constructor(private responseBuilder: ChatMessageCollectionResponseBuilder) {}

    async execute(query: ListChatIdMessagesQuery): Promise<CollectionResponseDtoInterface<ChatMessageDto>> {
        return await this.responseBuilder.build(query.id, query.page, query.perPage);
    }
}
