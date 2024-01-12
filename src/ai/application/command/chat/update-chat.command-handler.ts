import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateChatCommand } from './update-chat.command';
import { UpdateChatService } from '../../../domain/service/chat/update-chat.service';

@CommandHandler(UpdateChatCommand)
export class UpdateChatCommandHandler implements ICommandHandler<UpdateChatCommand> {
    constructor(private service: UpdateChatService) {}

    async execute(command: UpdateChatCommand): Promise<void> {
        await this.service.invoke(command.id, command.title);
    }
}
