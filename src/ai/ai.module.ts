import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateChatCommandHandler } from './application/command/chat/create-chat.command-handler';
import { GetChatQueryHandler } from './application/query/chat/get-chat.query-handler';
import { CreateChatService } from './domain/service/chat/create-chat.service';
import { UpdateChatCommandHandler } from './application/command/chat/update-chat.command-handler';
import { UpdateChatService } from './domain/service/chat/update-chat.service';
import { ListChatsQueryHandler } from './application/query/chat/list-chats.query-handler';
import { DeleteChatCommandHandler } from './application/command/chat/delete-chat.command-handler';
import { DeleteChatService } from './domain/service/chat/delete-chat.service';
import { ListChatMessagesQueryHandler } from './application/query/chat/list-chat-messages.query-handler';
import { GetChatAction } from './infrastructure/controller/chat/get-chat.action';
import { CreateChatAction } from './infrastructure/controller/chat/create-chat.action';
import { DeleteChatAction } from './infrastructure/controller/chat/delete-chat.action';
import { ChatSseAction } from './infrastructure/controller/chat/chat-sse.action';
import { UpdateChatAction } from './infrastructure/controller/chat/update-chat.action';
import { ListChatsAction } from './infrastructure/controller/chat/list-chats.action';
import { ListChatMessagesAction } from './infrastructure/controller/chat/list-chat-messages.action';
import { ChatRepositoryPrisma } from './infrastructure/persistence/prisma/chat/chat-repository-prisma';
import ChatResponseBuilder from './application/query/chat/responseBuilder/chat.response-builder';
import { ChatCollectionResponseBuilder } from './application/query/chat/responseBuilder/chat-collection.response-builder';
import { ChatMessageCollectionResponseBuilder } from './application/query/chat/responseBuilder/chat-message-collection.response-builder';
import { CreateChatMessageService } from './domain/service/chat/create-chat-message.service';
import { CreateChatMessageAction } from './infrastructure/controller/chat/create-chat-message.action';
import { GetChatMessageQueryHandler } from './application/query/chat/get-chat-message.query-handler';
import { CreateChatMessageCommandHandler } from './application/command/chat/create-chat-message.command-handler';
import ChatMessageResponseBuilder from './application/query/chat/responseBuilder/chat-message.response-builder';
import ChatMessageDtoProvider from './application/query/chat/dtoProvider/chat-message.dto-provider';
import ChatDtoProvider from './application/query/chat/dtoProvider/chat.dto-provider';
import { GetChatMessageAction } from './infrastructure/controller/chat/get-chat-message.action';
import { OpenAiChatResponseProvider } from './infrastructure/provider/openAi/open-ai.chat-response-provider';

const queryHandlers = [
    GetChatQueryHandler,
    ListChatsQueryHandler,
    ListChatMessagesQueryHandler,
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
            provide: 'ChatResponseProviderInterface',
            useClass: OpenAiChatResponseProvider,
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
