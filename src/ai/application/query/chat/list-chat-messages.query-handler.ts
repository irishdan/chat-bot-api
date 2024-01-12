import { QueryHandler } from '@nestjs/cqrs';
import { CollectionResponseDtoInterface } from '../../../../common/application/query/dto/collection-response-dto.interface';
import { ListChatMessagesQuery } from './list-chat-messages.query';
import { ChatMessageDto } from './dto/chat-message.dto';
import { ChatMessageCollectionResponseBuilder } from './responseBuilder/chat-message-collection.response-builder';

@QueryHandler(ListChatMessagesQuery)
export class ListChatMessagesQueryHandler {
    constructor(private responseBuilder: ChatMessageCollectionResponseBuilder) {}

    async execute(query: ListChatMessagesQuery): Promise<CollectionResponseDtoInterface<ChatMessageDto>> {
        return await this.responseBuilder.build(query.id, query.page, query.perPage);
    }
}
