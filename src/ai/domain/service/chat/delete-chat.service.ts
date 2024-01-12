import { Inject, Injectable } from '@nestjs/common';
import { ChatRepositoryInterface } from '../../model/chat/chat.repository.interface';
import { DeleteChatCommand } from '../../../application/command/chat/delete-chat.command';

@Injectable()
export class DeleteChatService {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
    ) {}

    async invoke(command: DeleteChatCommand): Promise<void> {
        await this.repository.delete(command.id);
    }
}
