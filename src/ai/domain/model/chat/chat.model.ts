import { Transform, Type } from 'class-transformer';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { ChatDto } from '../../../application/query/chat/dto/chat.dto';
import { ChatMessageModel } from './chat-message.model';
import DomainAggregateRoot from '../../../../common/domain/domain.aggregate-root';
import DtoInterface from 'src/common/application/query/dto/dto.interface';

export class ChatModel extends DomainAggregateRoot {
    public internalId = 0;
    public id: string;
    public title: string;

    @Type(() => ChatMessageModel)
    public messages?: ChatMessageModel[];

    public messageCount: number;

    @Transform(({ value }) => dayjs(value), { toClassOnly: true })
    public createdAt: Dayjs;

    static create(id: string, title: string, createdAt: Dayjs): ChatModel {
        const chat = new ChatModel();

        chat.id = id;
        chat.title = title;
        chat.createdAt = createdAt;

        return chat;
    }

    update(title: string): void {
        this.title = title;
    }

    addMessage(message: ChatMessageModel): void {
        if (!this.messages) {
            this.messages = [];
        }
        this.messages.push(message);
    }

    public get dto(): ChatDto {
        return new ChatDto(this.id, this.title, this.createdAt.toDate(), this.messageCount);
    }

    getDto(): DtoInterface {
        return this.dto;
    }
}
