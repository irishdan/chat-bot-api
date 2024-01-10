import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateChatMessageCommand } from './CreateChatMessageCommand';
import { CreateChatMessageService } from '../../../domain/service/chat/CreateChatMessageService';

@CommandHandler(CreateChatMessageCommand)
export class CreateChatMessageCommandHandler implements ICommandHandler<CreateChatMessageCommand> {
    constructor(private service: CreateChatMessageService) {}

    async execute(command: CreateChatMessageCommand): Promise<void> {
        await this.service.invoke(command.chatId, command.messageId, command.type, command.message);
    }
}
