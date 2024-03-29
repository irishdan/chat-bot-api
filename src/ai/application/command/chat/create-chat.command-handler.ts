import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateChatCommand } from './create-chat.command';
import { CreateChatService } from '../../../domain/service/chat/create-chat.service';

@CommandHandler(CreateChatCommand)
export class CreateChatCommandHandler implements ICommandHandler<CreateChatCommand> {
    constructor(private service: CreateChatService) {}

    async execute(command: CreateChatCommand): Promise<void> {
        await this.service.invoke(command.id, command.title);
    }
}
