import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CollectionRequestQueryParams } from '../../../../common/infrastructure/controller/request/collection-request-query-params';
import { CollectionResponseDtoInterface } from '../../../../common/application/query/dto/collection-response-dto.interface';
import { ChatDto } from '../../../application/query/chat/dto/chat.dto';
import { ListChatsQuery } from '../../../application/query/chat/list-chats.query';

@Controller('chats')
export class ListChatsAction {
    constructor(private queryBus: QueryBus) {}

    @Get()
    async invoke(@Query() query: CollectionRequestQueryParams): Promise<CollectionResponseDtoInterface<ChatDto>> {
        const listQuery = new ListChatsQuery(query.page, query.perPage);

        return await this.queryBus.execute(listQuery);
    }
}
