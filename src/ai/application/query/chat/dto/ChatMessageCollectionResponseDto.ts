import { ChatDto } from './ChatDto';
import { CollectionResponseDtoInterface } from '../../../../../common/application/query/dto/CollectionResponseDtoInterface';
import { ChatMessageDto } from './ChatMessageDto';

export type ChatMessageCollectionResponseDto = CollectionResponseDtoInterface<ChatMessageDto> & {
    included: { chats: { [key: string]: ChatDto } };
};
