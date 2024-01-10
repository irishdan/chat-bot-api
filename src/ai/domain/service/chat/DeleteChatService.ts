import { Inject, Injectable } from '@nestjs/common';
import { ChatRepositoryInterface } from '../../model/chat/ChatRepositoryInterface';
import { DeleteChatCommand } from '../../../application/command/chat/DeleteChatCommand';

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
