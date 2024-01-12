import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ChatResponseDto } from '../../../application/query/chat/dto/chat.response-dto';
import { GetChatQuery } from '../../../application/query/chat/get-chat.query';

@Controller('chats')
export class GetChatAction {
    constructor(private queryBus: QueryBus) {}

    @Get(':id')
    async invoke(@Param('id') id: string): Promise<ChatResponseDto> {
        const query = new GetChatQuery(id);
        return await this.queryBus.execute(query);
    }
}
