import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CollectionRequestQueryParams } from '../../../../common/infrastructure/controller/request/CollectionRequestQueryParams';
import { CollectionResponseDtoInterface } from '../../../../common/application/query/dto/CollectionResponseDtoInterface';
import { ChatMessageDto } from '../../../application/query/chat/dto/ChatMessageDto';
import { ListChatIdMessagesQuery } from '../../../application/query/chat/ListChatIdMessagesQuery';

@Controller('chats')
export class ListChatMessagesAction {
    constructor(private queryBus: QueryBus) {}

    @Get(':id/messages')
    async invoke(
        @Param('id') id: string,
        @Query() query: CollectionRequestQueryParams,
    ): Promise<CollectionResponseDtoInterface<ChatMessageDto>> {
        const listQuery = new ListChatIdMessagesQuery(id, query.page, query.perPage);

        return await this.queryBus.execute(listQuery);
    }
}
