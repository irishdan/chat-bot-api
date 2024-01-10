import { UpdateChatRequest } from '../../../infrastructure/controller/chat/request/UpdateChatRequest';

export class UpdateChatCommand {
    constructor(
        public id: string,
        public messages: { message: string; type: 'system' | 'human' | 'ai' }[],
    ) {}

    static fromRequest(id: string, dto: UpdateChatRequest): UpdateChatCommand {
        return new UpdateChatCommand(id, dto.messages);
    }
}
