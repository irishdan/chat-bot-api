import { Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { AIMessage, HumanMessage, SystemMessage } from 'langchain/schema';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import ChatMessageDtoProvider from '../../../application/query/chat/dtoProvider/chat-message.dto-provider';
import { ChatMessageModel } from '../../../domain/model/chat/chat-message.model';
import ChatResponseProviderInterface from '../../../domain/model/chat/chat-response-provider.interface';
import { OpenAiStatelessChatPrompter } from './prompter/open-ai-stateless.chat-prompter';

@Injectable()
export class LangChainOpenAiChatResponseProvider implements ChatResponseProviderInterface {
    protected prompter: OpenAiStatelessChatPrompter;
    protected CHAT_HISTORY_MAX_ITEMS = 50;

    constructor(
        private configService: ConfigService,
        private eventEmitter: EventEmitter2,
        private messageDtoProvider: ChatMessageDtoProvider,
    ) {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');

        // This will error on application start if the API key is not provided
        if (!apiKey) {
            throw new Error('No OPENAI_API_KEY provided. Please set this in .env');
        }

        this.prompter = new OpenAiStatelessChatPrompter(apiKey);
    }

    async promptForResponse(chatId: string, prompts: ChatMessageModel[]): Promise<ChatMessageModel | null> {
        let input = '';

        // using the last 50 messages without the initial system message is not ideal
        // look at implementing token tracking to maximise the number of messages we can use
        const chatMessageDtos = await this.messageDtoProvider.list(chatId, 1, this.CHAT_HISTORY_MAX_ITEMS, 'asc');

        prompts.forEach((prompt) => chatMessageDtos.unshift(prompt.dto));

        const messages = chatMessageDtos
            .map((message, index) => {
                if (index === 0 && message.type !== 'ai') {
                    input = message.message;
                    return;
                }

                return new {
                    system: SystemMessage,
                    human: HumanMessage,
                    ai: AIMessage,
                }[message.type](message.message);
            })
            .filter(Boolean);

        // If there is no input, we don't need to do anything
        if (input.length === 0) {
            return null;
        }

        const response = await this.prompter.prompt(input, messages, 'Buffer', true, [
            (token) => {
                this.eventEmitter.emit(`chat.message.${chatId}`, {
                    token,
                });
            },
        ]);

        return new ChatMessageModel(response.responseId, response.response, 'ai', dayjs());
    }
}
