import { Controller, Delete, HttpCode, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteChatCommand } from '../../../application/command/chat/delete-chat.command';

@Controller('chats')
export class DeleteChatAction {
    constructor(private commandBus: CommandBus) {}

    @Delete(':id')
    @HttpCode(204)
    async invoke(@Param('id') id: string): Promise<any> {
        const command = new DeleteChatCommand(id);
        return await this.commandBus.execute(command);
    }
}
