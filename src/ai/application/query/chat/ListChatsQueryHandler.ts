import { QueryHandler } from '@nestjs/cqrs';
import { ListChatsQuery } from './ListChatsQuery';
import { CollectionResponseDtoInterface } from '../../../../common/application/query/dto/CollectionResponseDtoInterface';
import { ChatDto } from './dto/ChatDto';
import { ChatCollectionResponseBuilder } from './responseBuilder/ChatCollectionResponseBuilder';

@QueryHandler(ListChatsQuery)
export class ListChatsQueryHandler {
    constructor(private responseBuilder: ChatCollectionResponseBuilder) {}

    async execute(query: ListChatsQuery): Promise<CollectionResponseDtoInterface<ChatDto>> {
        return await this.responseBuilder.build(query.page, query.perPage);
    }
}
