import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteChatCommand } from './delete-chat.command';
import { DeleteChatService } from '../../../domain/service/chat/delete-chat.service';

@CommandHandler(DeleteChatCommand)
export class DeleteChatCommandHandler implements ICommandHandler<DeleteChatCommand> {
    constructor(private service: DeleteChatService) {}

    async execute(command: DeleteChatCommand): Promise<void> {
        await this.service.invoke(command);
    }
}
