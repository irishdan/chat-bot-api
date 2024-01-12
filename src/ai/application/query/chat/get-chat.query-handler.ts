import { QueryHandler } from '@nestjs/cqrs';
import { GetChatQuery } from './get-chat.query';
import { ChatResponseDto } from './dto/chat.response-dto';
import ChatResponseBuilder from './responseBuilder/chat.response-builder';
import { NotFoundException } from '@nestjs/common';
import ResourceNotFoundException from '../../../../common/application/exception/resource-not-found.exception';

@QueryHandler(GetChatQuery)
export class GetChatQueryHandler {
    constructor(private reponseBuilder: ChatResponseBuilder) {}

    async execute(query: GetChatQuery): Promise<ChatResponseDto> {
        return await this.reponseBuilder.build(query.id);
    }
}
