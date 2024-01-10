import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CollectionRequestQueryParams } from '../../../../common/infrastructure/controller/request/CollectionRequestQueryParams';
import { CollectionResponseDtoInterface } from '../../../../common/application/query/dto/CollectionResponseDtoInterface';
import { ChatDto } from '../../../application/query/chat/dto/ChatDto';
import { ListChatsQuery } from '../../../application/query/chat/ListChatsQuery';

@Controller('chats')
export class ListChatsAction {
    constructor(private queryBus: QueryBus) {}

    @Get()
    async invoke(@Query() query: CollectionRequestQueryParams): Promise<CollectionResponseDtoInterface<ChatDto>> {
        const listQuery = new ListChatsQuery(query.page, query.perPage);

        return await this.queryBus.execute(listQuery);
    }
}
