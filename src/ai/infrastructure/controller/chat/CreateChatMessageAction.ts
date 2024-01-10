import { Body, Controller, Param, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import CreateChatMessageRequest from './request/CreateChatMessageRequest';
import { CreateChatMessageCommand } from '../../../application/command/chat/CreateChatMessageCommand';
import { GetChatMessageQuery } from '../../../application/query/chat/GetChatMessageQuery';

@Controller('chats')
export class CreateChatMessageAction {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @Post(':id/messages')
    async invoke(@Param('id') chatId: string, @Body() dto: CreateChatMessageRequest) {
        const messageId = randomUUID();

        const command = CreateChatMessageCommand.fromRequest(chatId, messageId, dto);
        await this.commandBus.execute(command);

        const query = new GetChatMessageQuery(chatId, messageId);
        return await this.queryBus.execute(query);
    }
}
