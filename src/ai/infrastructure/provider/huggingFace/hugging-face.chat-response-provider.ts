import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { HfInference } from '@huggingface/inference';
import * as dayjs from 'dayjs';
import { randomUUID } from 'crypto';
import ChatMessageDtoProvider from '../../../application/query/chat/dtoProvider/chat-message.dto-provider';
import { ChatMessageModel } from '../../../domain/model/chat/chat-message.model';
import ChatResponseProviderInterface from '../../../domain/model/chat/chat-response-provider.interface';
@Injectable()
export class HuggingFaceChatResponseProvider implements ChatResponseProviderInterface {
    protected readonly MAX_HISTORY_MESSAGES = 50;
    protected readonly hf: HfInference;

    constructor(
        private configService: ConfigService,
        private eventEmitter: EventEmitter2,
        private messageDtoProvider: ChatMessageDtoProvider,
    ) {
        // this.hf = new HfInference('your access token');
        this.hf = new HfInference();
    }

    async promptForResponse(chatId: string, prompts: ChatMessageModel[]): Promise<ChatMessageModel | null> {
        const id = randomUUID();
        const chatMessageDtos = await this.messageDtoProvider.list(chatId, 1, this.MAX_HISTORY_MESSAGES, 'asc');

        prompts.forEach((prompt) => chatMessageDtos.push(prompt.dto));

        let output = null;
        for await (const response of this.hf.textGenerationStream({
            model: 'google/flan-t5-xxl',
            inputs: prompts[0].message,
        })) {
            this.eventEmitter.emit(`chat.message.${chatId}`, {
                token: response.token.text,
            });
            output = response;
        }

        return new ChatMessageModel(id, output.generated_text, 'ai', dayjs());}
}
