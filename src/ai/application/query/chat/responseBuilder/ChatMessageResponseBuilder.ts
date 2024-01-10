import { Injectable } from '@nestjs/common';
import ChatDtoProvider from '../dtoProvider/ChatDtoProvider';
import ChatMessageDtoProvider from '../dtoProvider/ChatMessageDtoProvider';
import { ChatMessageResponseDto, ChatMessageResponseDtoMeta } from '../dto/ChatMessageResponseDto';

@Injectable()
export default class ChatMessageResponseBuilder {
    constructor(
        private dtoProvider: ChatMessageDtoProvider,
        private chatDtoProvider: ChatDtoProvider,
    ) {}

    async build(id: string): Promise<ChatMessageResponseDto> {
        const messageDto = await this.dtoProvider.getById(id);
        const chatDto = await this.chatDtoProvider.getById(messageDto.chatId);

        // if its human message,
        // there should be a response message
        // if its an AI message
        // there should be a prompt message
        const meta: ChatMessageResponseDtoMeta = {};
        if (messageDto.type === 'human') {
            const responseMessageDto = await this.dtoProvider.getByPromptMessageId(messageDto.id);
            if (responseMessageDto) {
                meta.responseMessage = responseMessageDto;
            }
        } else if (messageDto.type === 'ai' && messageDto.promptMessageId) {
            const promptMessageDto = await this.dtoProvider.getById(messageDto.promptMessageId);
            if (promptMessageDto) {
                meta.promptMessage = promptMessageDto;
            }
        }

        return {
            item: messageDto,
            included: {
                chats: { [messageDto.chatId]: chatDto },
            },
            meta
        };
    }
}
