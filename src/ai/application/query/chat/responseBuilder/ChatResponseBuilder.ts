import ChatDtoProvider from '../dtoProvider/ChatDtoProvider';
import { ChatResponseDto } from '../dto/ChatResponseDto';
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
