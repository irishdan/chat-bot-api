import { UpdateChatRequest } from '../../../infrastructure/controller/chat/request/update-chat.request';

export class UpdateChatCommand {
    constructor(
        public id: string,
        public title: string
    ) {}

    static fromRequest(id: string, dto: UpdateChatRequest): UpdateChatCommand {
        return new UpdateChatCommand(id, dto.title);
    }
}
