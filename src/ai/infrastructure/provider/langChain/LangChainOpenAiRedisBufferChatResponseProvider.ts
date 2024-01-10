import { Injectable } from '@nestjs/common';
import { AIMessage, HumanMessage, SystemMessage } from 'langchain/schema';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as dayjs from 'dayjs';
import ChatMessageDtoProvider from '../../../application/query/chat/dtoProvider/ChatMessageDtoProvider';
import { ChatMessageModel } from '../../../domain/model/chat/ChatMessageModel';
import ChatResponseProviderInterface from '../../../domain/model/chat/ChatResponseProviderInterface';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import { RedisChatMessageHistory } from 'langchain/stores/message/ioredis';
import { randomUUID } from 'crypto';
import { CallbackHandlerMethods } from '@langchain/core/dist/callbacks/base';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import ChatDtoProvider from '../../../application/query/chat/dtoProvider/ChatDtoProvider';

export type RedisMessageHistoryCacheItem = {
    buffer: BufferMemory;
    chain: ConversationChain;
};

@Injectable()
export class LangChainOpenAiRedisBufferChatResponseProvider implements ChatResponseProviderInterface {
    protected CACHE_MAX_ITEMS = 50;
    protected CHAT_HISTORY_MAX_ITEMS = 50;
    protected cache: { [key: string]: RedisMessageHistoryCacheItem };
    protected responseId: string = '';

    constructor(
        private configService: ConfigService,
        private eventEmitter: EventEmitter2,
        private messageDtoProvider: ChatMessageDtoProvider,
        private chatDtoProvider: ChatDtoProvider,
    ) {
        this.cache = {};

        const apiKey = this.configService.get<string>('OPENAI_API_KEY');

        // This will error on application start if the API key is not provided
        if (!apiKey) {
            throw new Error('No OPENAI_API_KEY provided. Please set this in .env');
        }
    }

    async promptForResponse(chatId: string, newPrompts: ChatMessageModel[]): Promise<ChatMessageModel | null> {
        let input = '';
        this.responseId = randomUUID();

        // The conversation chain and buffer are cached in memory
        // the buffer items are stored in redis.
        // both of which can expire or be expunged from memory
        // so
        // if the cache is empty create/recreate it
        if (!this.cache[chatId]) {
            this.initializeChatCache(chatId);
        }

        // Compare the model message cound with the buffer message count
        // if any messages are missing, reload the messages into the buffer
        // from the dtoProvider
        const chatDto = await this.chatDtoProvider.getById(chatId);
        const buffer = this.cache[chatId].buffer;
        const bufferMessages = await buffer.chatHistory.getMessages();

        if (chatDto.messageCount > 0 && bufferMessages.length < chatDto.messageCount) {
            // message counts do not match reload messages into the buffer
            // @TODO: This needs to be smarter!
            // using the last 50 messages without the initial system message is not ideal
            // look at implementing token tracking to maximise the number of messages we can use
            const chatMessageDtos = await this.messageDtoProvider.list(chatId, 1, this.CHAT_HISTORY_MAX_ITEMS, 'asc');

            newPrompts.forEach((prompt) => chatMessageDtos.unshift(prompt.dto));

            await this.cache[chatId].buffer.chatHistory.clear();

            chatMessageDtos.map((message, index) => {
                if (index === 0 && message.type !== 'ai') {
                    input = message.message;
                    return;
                }

                this.cache[chatId].buffer.chatHistory.addMessage(
                    new {
                        system: SystemMessage,
                        human: HumanMessage,
                        ai: AIMessage,
                    }[message.type](message.message),
                );
            });

            // If there is no input, we don't need to do anything
            if (input.length === 0) {
                return null;
            }
        } else {
            input = newPrompts[0].message;
        }

        const result = await this.cache[chatId].chain.call({ input });

        return new ChatMessageModel(this.responseId, result.response, 'ai', dayjs());
    }

    protected initializeChatCache = async (chatId: string): Promise<void> => {
        const callbacks: CallbackHandlerMethods[] = [
            {
                handleLLMEnd: (output, runId) => {
                    this.responseId = runId;
                },
            },
            {
                handleLLMNewToken: (token) => {
                    this.eventEmitter.emit(`chat.message.${chatId}`, {
                        token,
                    });
                },
            },
        ];

        const chatAi = new ChatOpenAI({
            openAIApiKey: this.configService.get<string>('OPENAI_API_KEY'),
            streaming: true,
            callbacks,
        });

        const redisHost = this.configService.get<string>('REDIS_HOST');
        const redisPort = this.configService.get<number>('REDIS_PORT');

        const buffer = new BufferMemory({
            chatHistory: new RedisChatMessageHistory({
                sessionId: 'chat-message-history:' + chatId,
                sessionTTL: 1200,
                url: `redis://${redisHost}:${redisPort}`,
            }),
        });

        const chain = new ConversationChain({
            llm: chatAi,
            memory: buffer,
        });

        this.setCacheItem(chatId, { buffer, chain });
    };

    protected setCacheItem = (key: string, item: RedisMessageHistoryCacheItem): void => {
        const keys = Object.keys(this.cache);
        if (keys.length >= this.CACHE_MAX_ITEMS) {
            delete this.cache[keys[0]];
        }
        this.cache[key] = item;
    };
}
