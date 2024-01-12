import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ChatResponseDto } from '../../../application/query/chat/dto/chat.response-dto';
import { UpdateChatRequest } from './request/update-chat.request';
import { UpdateChatCommand } from '../../../application/command/chat/update-chat.command';
import { GetChatQuery } from '../../../application/query/chat/get-chat.query';

@Controller('chats')
export class UpdateChatAction {
    constructor(
        private commandBus: CommandBus,
        private queryBus: QueryBus,
    ) {}

    @Patch(':id')
    async invoke(@Param('id') id: string, @Body() requestDto: UpdateChatRequest): Promise<ChatResponseDto> {
        const command = UpdateChatCommand.fromRequest(id, requestDto);
        await this.commandBus.execute(command);

        const query = new GetChatQuery(id);
        return await this.queryBus.execute(query);
    }
}
