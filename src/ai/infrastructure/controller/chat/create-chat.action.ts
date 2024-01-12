import { Body, Controller, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetChatQuery } from '../../../application/query/chat/get-chat.query';
import { CreateChatCommand } from '../../../application/command/chat/create-chat.command';
import { CreateChatRequest } from './request/create-chat.request';

@Controller('chats')
export class CreateChatAction {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @Post()
    async invoke(@Body() dto: CreateChatRequest) {
        const id = randomUUID();

        const command = CreateChatCommand.fromRequest(id, dto);
        await this.commandBus.execute(command);

        const query = new GetChatQuery(id);
        return await this.queryBus.execute(query);
    }
}
