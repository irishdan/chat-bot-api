import { Controller, Param, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetChatMessageQuery } from '../../../application/query/chat/get-chat-message.query';

@Controller('chats')
export class GetChatMessageAction {
    constructor(private queryBus: QueryBus) {}

    @Get(':chatId/messages/:messageId')
    async invoke(@Param('chatId') chatId: string, @Param('messageId') messageId: string) {
        const query = new GetChatMessageQuery(chatId, messageId);
        return await this.queryBus.execute(query);
    }
}
