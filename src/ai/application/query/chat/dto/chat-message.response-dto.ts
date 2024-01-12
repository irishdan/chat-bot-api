import { ItemResponseDtoInterface } from '../../../../../common/application/query/dto/item-response-dto.interface';
import { ChatMessageDto } from './chat-message.dto';
import { ChatDto } from './chat.dto';

export type ChatMessageResponseDtoMeta = {
    responseMessage?: ChatMessageDto;
    promptMessage?: ChatMessageDto;
}

export type ChatMessageResponseDto = ItemResponseDtoInterface<ChatMessageDto> & {
    included: { chats: { [key: string]: ChatDto } };
    meta: ChatMessageResponseDtoMeta;
};
