import { QueryHandler } from '@nestjs/cqrs';
import { GetChatMessageQuery } from './get-chat-message.query';
import ChatMessageResponseBuilder from './responseBuilder/chat-message.response-builder';

@QueryHandler(GetChatMessageQuery)
export class GetChatMessageQueryHandler {
    constructor(private responseBuilder: ChatMessageResponseBuilder) {}

    async execute(query: GetChatMessageQuery): Promise<any> {
        return this.responseBuilder.build(query.chatId, query.messageId);
    }
}
