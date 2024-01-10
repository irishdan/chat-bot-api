import { ItemResponseDtoInterface } from '../../../../../common/application/query/dto/ItemResponseDtoInterface';
import { ChatMessageDto } from './ChatMessageDto';
import { ChatDto } from './ChatDto';

export type ChatMessageResponseDtoMeta = {
    responseMessage?: ChatMessageDto;
    promptMessage?: ChatMessageDto;
}

export type ChatMessageResponseDto = ItemResponseDtoInterface<ChatMessageDto> & {
    included: { chats: { [key: string]: ChatDto } };
    meta: ChatMessageResponseDtoMeta;
};
