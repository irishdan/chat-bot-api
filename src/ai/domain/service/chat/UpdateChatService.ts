import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ChatRepositoryInterface } from '../../model/chat/ChatRepositoryInterface';
import { randomUUID } from 'crypto';
import { UpdateChatCommand } from '../../../application/command/chat/UpdateChatCommand';
import { ChatMessageModel } from '../../model/chat/ChatMessageModel';
import ChatResponseProviderInterface from '../../model/chat/ChatResponseProviderInterface';

@Injectable()
export class UpdateChatService {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
        @Inject('ChatHandlerInterface')
        private llmHandler: ChatResponseProviderInterface,
    ) {}

    async invoke(command: UpdateChatCommand): Promise<void> {
        // @TODO: this should not be interacting with the LLM...
        const dateNow = dayjs();
        const chatModel = await this.repository.findById(command.id);

        const promptMessages: ChatMessageModel[] = [];
        command.messages.map((message) => {
            const promptMessage = new ChatMessageModel(randomUUID(), message.message, message.type, dateNow);
            promptMessages.push(promptMessage);
            chatModel.addMessage(promptMessage);
        });

        const aiResponseMessage = await this.llmHandler.promptForResponse(command.id, promptMessages);
        if (aiResponseMessage) {
            chatModel.addMessage(aiResponseMessage);
        }

        // @TODO: Invoke summarise chat service via events/saga
        await this.repository.persist(chatModel);
    }
}
