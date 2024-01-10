import { QueryHandler } from '@nestjs/cqrs';
import { GetChatMessageQuery } from './GetChatMessageQuery';
import ChatMessageResponseBuilder from './responseBuilder/ChatMessageResponseBuilder';

@QueryHandler(GetChatMessageQuery)
export class GetChatMessageQueryHandler {
    constructor(private responseBuilder: ChatMessageResponseBuilder) {}

    async execute(query: GetChatMessageQuery): Promise<any> {
        return this.responseBuilder.build(query.messageId);
    }
}
