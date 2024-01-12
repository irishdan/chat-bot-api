import ChatDtoProvider from '../dtoProvider/chat.dto-provider';
import { ChatResponseDto } from '../dto/chat.response-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class ChatResponseBuilder {
    constructor(
        private dtoProvider: ChatDtoProvider
    ) {}

    async build(id: string): Promise<ChatResponseDto> {
        const dto = await this.dtoProvider.getById(id);

        return { item: dto };
    }
}
