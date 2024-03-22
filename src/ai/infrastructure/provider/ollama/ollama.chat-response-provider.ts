import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import ollama from 'ollama';
import * as dayjs from 'dayjs';
import ChatMessageDtoProvider from '../../../application/query/chat/dtoProvider/chat-message.dto-provider';
import { ChatMessageModel } from '../../../domain/model/chat/chat-message.model';
import ChatResponseProviderInterface from '../../../domain/model/chat/chat-response-provider.interface';
import { randomUUID } from 'crypto';

@Injectable()
export class OllamaChatResponseProvider implements ChatResponseProviderInterface {
    protected readonly MAX_HISTORY_MESSAGES = 50;

    constructor(
        private configService: ConfigService,
        private eventEmitter: EventEmitter2,
        private messageDtoProvider: ChatMessageDtoProvider,
    ) {}

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
                        };
                    case 'human':
                        return {
                            content: message.message,
                            role: 'user',
                        };
                    case 'system':
                        return {
                            content: message.message,
                            role: 'system',
                        };
                }
            })
            .filter(Boolean);

        const response = await ollama.chat({
            model: this.configService.get<string>('OLLAMA_MODEL') ?? 'llama2',
            messages: messages,
            stream: true,
        });

        let completeText = '';
        for await (const part of response) {
            completeText = completeText + part.message.content;

            this.eventEmitter.emit(`chat.message.${chatId}`, {
                delta: part.message.content,
            });
        }

        return new ChatMessageModel(randomUUID(), completeText, 'ai', dayjs());
    }
}
