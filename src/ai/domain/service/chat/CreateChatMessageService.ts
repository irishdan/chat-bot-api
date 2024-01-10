import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ChatRepositoryInterface } from '../../model/chat/ChatRepositoryInterface';
import { ChatMessageModel } from '../../model/chat/ChatMessageModel';
import ChatResponseProviderInterface from '../../model/chat/ChatResponseProviderInterface';

@Injectable()
export class CreateChatMessageService {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
        @Inject('ChatHandlerInterface')
        private llmHandler: ChatResponseProviderInterface,
    ) {}

    async invoke(chatId: string, messageId: string, type: 'human' | 'system' | 'ai', message: string): Promise<void> {
        const dateNow = dayjs();
        const chatModel = await this.repository.findById(chatId);

        const chatMessage = new ChatMessageModel(messageId, message, type, dateNow);
        chatModel.addMessage(chatMessage);

        const aiResponseMessage = await this.llmHandler.promptForResponse(chatId, [chatMessage]);
        if (aiResponseMessage) {
            aiResponseMessage.setPromptMessageId(messageId);
            chatModel.addMessage(aiResponseMessage);
        }

        await this.repository.persist(chatModel);
    }
}
