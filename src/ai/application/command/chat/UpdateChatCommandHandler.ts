import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateChatCommand } from './UpdateChatCommand';
import { UpdateChatService } from '../../../domain/service/chat/UpdateChatService';

@CommandHandler(UpdateChatCommand)
export class UpdateChatCommandHandler implements ICommandHandler<UpdateChatCommand> {
    constructor(private service: UpdateChatService) {}

    async execute(command: UpdateChatCommand): Promise<void> {
        await this.service.invoke(command);
    }
}
