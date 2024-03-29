import { Inject, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { ChatRepositoryInterface } from '../../model/chat/chat.repository.interface';
import { ChatModel } from '../../model/chat/chat.model';

@Injectable()
export class CreateChatService {
    constructor(
        @Inject('ChatRepositoryInterface')
        private repository: ChatRepositoryInterface,
    ) {}

    async invoke(id: string, title: string): Promise<void> {
        const dateNow = dayjs();
        const chatModel = ChatModel.create(id, title, dateNow);

        await this.repository.persist(chatModel);
    }
}
