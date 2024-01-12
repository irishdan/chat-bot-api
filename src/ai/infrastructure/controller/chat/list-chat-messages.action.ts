import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CollectionRequestQueryParams } from '../../../../common/infrastructure/controller/request/collection-request-query-params';
import { CollectionResponseDtoInterface } from '../../../../common/application/query/dto/collection-response-dto.interface';
import { ChatMessageDto } from '../../../application/query/chat/dto/chat-message.dto';
import { ListChatMessagesQuery } from '../../../application/query/chat/list-chat-messages.query';

@Controller('chats')
export class ListChatMessagesAction {
    constructor(private queryBus: QueryBus) {}

    @Get(':id/messages')
    async invoke(
        @Param('id') id: string,
        @Query() query: CollectionRequestQueryParams,
    ): Promise<CollectionResponseDtoInterface<ChatMessageDto>> {
        const listQuery = new ListChatMessagesQuery(id, query.page, query.perPage);

        return await this.queryBus.execute(listQuery);
    }
}
