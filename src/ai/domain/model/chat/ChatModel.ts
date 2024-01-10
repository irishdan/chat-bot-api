import { Transform, Type } from 'class-transformer';
import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
import { ChatDto } from '../../../application/query/chat/dto/ChatDto';
import { ChatMessageModel } from './ChatMessageModel';
import DomainAbstractRoot from '../../../../common/domain/DomainAbstractRoot';
import DtoInterface from 'src/common/application/query/dto/DtoInterface';

export class ChatModel extends DomainAbstractRoot {
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
