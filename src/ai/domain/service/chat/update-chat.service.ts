import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ChatRepositoryInterface } from '../../model/chat/chat.repository.interface';
import ChatResponseProviderInterface from '../../model/chat/chat-response-provider.interface';

@Injectable()
export class UpdateChatService {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
        @Inject('ChatResponseProviderInterface')
        private llmHandler: ChatResponseProviderInterface,
    ) {}

    async invoke(id: string, title: string): Promise<void> {
        const chatModel = await this.repository.findById(id);

        chatModel.update(title);

        await this.repository.persist(chatModel);
    }
}
