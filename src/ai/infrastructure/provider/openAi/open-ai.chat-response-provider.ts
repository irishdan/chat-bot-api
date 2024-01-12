import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
    ChatCompletionUserMessageParam,
    ChatCompletionSystemMessageParam,
    ChatCompletionAssistantMessageParam,
} from 'openai/resources';
import OpenAI from 'openai';
import * as dayjs from 'dayjs';
import ChatMessageDtoProvider from '../../../application/query/chat/dtoProvider/chat-message.dto-provider';
import { ChatMessageModel } from '../../../domain/model/chat/chat-message.model';
import ChatResponseProviderInterface from '../../../domain/model/chat/chat-response-provider.interface';

@Injectable()
export class OpenAiChatResponseProvider implements ChatResponseProviderInterface {
    protected readonly MAX_HISTORY_MESSAGES = 50;
    protected readonly openAi: OpenAI;

    constructor(
        private configService: ConfigService,
        private eventEmitter: EventEmitter2,
        private messageDtoProvider: ChatMessageDtoProvider,
    ) {
        this.openAi = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        });
    }

    async promptForResponse(chatId: string, prompts: ChatMessageModel[]): Promise<ChatMessageModel | null> {
        const chatMessageDtos = await this.messageDtoProvider.list(chatId, 1, this.MAX_HISTORY_MESSAGES, 'asc');

        prompts.forEach((prompt) => chatMessageDtos.push(prompt.dto));

        const messages = chatMessageDtos
            .map((message) => {
                switch (message.type) {
                    case 'ai':
                        return {
                            content: message.message,
                            role: 'assistant',
                        } as ChatCompletionAssistantMessageParam;
                    case 'human':
                        return {
                            content: message.message,
                            role: 'user',
                        } as ChatCompletionUserMessageParam;
                    case 'system':
                        return {
                            content: message.message,
                            role: 'system',
                        } as ChatCompletionSystemMessageParam;
                }
            })
            .filter(Boolean);

        const stream = this.openAi.beta.chat.completions.stream({
            model: 'gpt-4',
            messages,
            stream: true,
        });

        stream.on('content', (delta) => {
            this.eventEmitter.emit(`chat.message.${chatId}`, {
                delta,
            });
        });

        const chatCompletion = await stream.finalChatCompletion();

        return new ChatMessageModel(chatCompletion.id, chatCompletion.choices[0].message.content, 'ai', dayjs());
    }
}
