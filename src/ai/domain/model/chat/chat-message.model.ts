import { Dayjs } from 'dayjs';
import { Transform } from 'class-transformer';
import * as dayjs from 'dayjs';
import { ChatMessageDto } from '../../../application/query/chat/dto/chat-message.dto';

export class ChatMessageModel {
    @Transform(({ value }) => dayjs(value), { toClassOnly: true })
    public readonly createdAt: Dayjs;
    public chatId?: string;
    public promptMessageId?: string;

    constructor(
        public readonly id: string,
        public readonly message: string,
        public readonly type: 'system' | 'human' | 'ai',
        createdAt: Dayjs,
        public readonly internalId?: number,
    ) {
        this.createdAt = createdAt;
    }

    public get dto(): ChatMessageDto {
        return new ChatMessageDto(
            this.id,
            this.message,
            this.type,
            this.createdAt.toDate(),
            this.chatId,
            this.promptMessageId,
        );
    }

    public setPromptMessageId(messageId: string): void {
        this.promptMessageId = messageId;
    }
}
