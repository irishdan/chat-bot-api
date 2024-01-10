import { QueryHandler } from '@nestjs/cqrs';
import { GetChatQuery } from './GetChatQuery';
import { ChatResponseDto } from './dto/ChatResponseDto';
import ChatResponseBuilder from './responseBuilder/ChatResponseBuilder';

@QueryHandler(GetChatQuery)
export class GetChatQueryHandler {
    constructor(private reponseBuilder: ChatResponseBuilder) {}

    async execute(query: GetChatQuery): Promise<ChatResponseDto> {
        return await this.reponseBuilder.build(query.id);
    }
}
