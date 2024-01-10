import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateChatCommandHandler } from './application/command/chat/CreateChatCommandHandler';
import { GetChatQueryHandler } from './application/query/chat/GetChatQueryHandler';
import { CreateChatService } from './domain/service/chat/CreateChatService';
import { UpdateChatCommandHandler } from './application/command/chat/UpdateChatCommandHandler';
import { UpdateChatService } from './domain/service/chat/UpdateChatService';
import { ListChatsQueryHandler } from './application/query/chat/ListChatsQueryHandler';
import { DeleteChatCommandHandler } from './application/command/chat/DeleteChatCommandHandler';
import { DeleteChatService } from './domain/service/chat/DeleteChatService';
import { ListChatIdMessagesQueryHandler } from './application/query/chat/ListChatIdMessagesQueryHandler';
import { GetChatAction } from './infrastructure/controller/chat/GetChatAction';
import { CreateChatAction } from './infrastructure/controller/chat/CreateChatAction';
import { DeleteChatAction } from './infrastructure/controller/chat/DeleteChatAction';
import { ChatSseAction } from './infrastructure/controller/chat/ChatSseAction';
import { UpdateChatAction } from './infrastructure/controller/chat/UpdateChatAction';
import { ListChatsAction } from './infrastructure/controller/chat/ListChatsAction';
import { ListChatMessagesAction } from './infrastructure/controller/chat/ListChatMessagesAction';
import { ChatRepositoryPrisma } from './infrastructure/persistence/prisma/chat/ChatRepositoryPrisma';
import ChatResponseBuilder from './application/query/chat/responseBuilder/ChatResponseBuilder';
import { ChatCollectionResponseBuilder } from './application/query/chat/responseBuilder/ChatCollectionResponseBuilder';
import { ChatMessageCollectionResponseBuilder } from './application/query/chat/responseBuilder/ChatMessageCollectionResponseBuilder';
import { CreateChatMessageService } from './domain/service/chat/CreateChatMessageService';
import { CreateChatMessageAction } from './infrastructure/controller/chat/CreateChatMessageAction';
import { GetChatMessageQueryHandler } from './application/query/chat/GetChatMessageQueryHandler';
import { CreateChatMessageCommandHandler } from './application/command/chat/CreateChatMessageCommandHandler';
import ChatMessageResponseBuilder from './application/query/chat/responseBuilder/ChatMessageResponseBuilder';
import ChatMessageDtoProvider from './application/query/chat/dtoProvider/ChatMessageDtoProvider';
import ChatDtoProvider from './application/query/chat/dtoProvider/ChatDtoProvider';
import { OpenAiChatResponseProvider } from './infrastructure/provider/openAi/OpenAiChatResponseProvider';
import { GetChatMessageAction } from './infrastructure/controller/chat/GetChatMessageAction';
import {
    LangChainOpenAiRedisBufferChatResponseProvider
} from './infrastructure/provider/langChain/LangChainOpenAiRedisBufferChatResponseProvider';

const queryHandlers = [
    GetChatQueryHandler,
    ListChatsQueryHandler,
    ListChatIdMessagesQueryHandler,
    GetChatMessageQueryHandler,
];

const commandHandlers = [
    CreateChatCommandHandler,
    DeleteChatCommandHandler,
    UpdateChatCommandHandler,
    CreateChatMessageCommandHandler,
];

const controllers = [
    CreateChatAction,
    GetChatAction,
    UpdateChatAction,
    DeleteChatAction,
    ChatSseAction,
    ListChatsAction,
    GetChatMessageAction,
    CreateChatMessageAction,
    ListChatMessagesAction,
];

const domainServices = [
    CreateChatMessageService,
    CreateChatService,
    DeleteChatService,
    UpdateChatService,
];

@Module({
    imports: [CqrsModule],
    controllers,
    providers: [
        ...commandHandlers,
        ...queryHandlers,
        ...domainServices,
        {
            provide: 'ChatHandlerInterface',
            useClass: LangChainOpenAiRedisBufferChatResponseProvider,
        },
        {
            provide: 'ChatRepositoryInterface',
            useClass: ChatRepositoryPrisma,
        },
        ChatResponseBuilder,
        ChatMessageResponseBuilder,
        ChatCollectionResponseBuilder,
        ChatMessageCollectionResponseBuilder,
        ChatMessageDtoProvider,
        ChatDtoProvider
    ],
})
export class AiModule {}
