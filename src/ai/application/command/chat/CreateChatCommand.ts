import { CreateChatRequest } from '../../../infrastructure/controller/chat/request/CreateChatRequest';

export class CreateChatCommand {
    public messages: [];
    constructor(
        public readonly id: string,
        public readonly title: string,
    ) {}

    static fromRequest(id: string, dto: CreateChatRequest): CreateChatCommand {
        return new CreateChatCommand(id, dto.title);
    }
}
