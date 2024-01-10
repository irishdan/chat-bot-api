import CreateChatMessageRequest from '../../../infrastructure/controller/chat/request/CreateChatMessageRequest';

export class CreateChatMessageCommand {
    constructor(
        public readonly chatId: string,
        public readonly messageId: string,
        public readonly type: 'system' | 'human',
        public readonly message: string,
    ) {}

    static fromRequest(chatId: string, messageId: string, dto: CreateChatMessageRequest): CreateChatMessageCommand {
        return new CreateChatMessageCommand(chatId, messageId, dto.type, dto.message);
    }
}
