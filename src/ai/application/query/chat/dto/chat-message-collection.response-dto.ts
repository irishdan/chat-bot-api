import { ChatDto } from './chat.dto';
import { CollectionResponseDtoInterface } from '../../../../../common/application/query/dto/collection-response-dto.interface';
import { ChatMessageDto } from './chat-message.dto';

export type ChatMessageCollectionResponseDto = CollectionResponseDtoInterface<ChatMessageDto> & {
    included: { chats: { [key: string]: ChatDto } };
};
