export class GetChatMessageQuery {
    constructor(
        public readonly chatId: string,
        public readonly messageId: string,
    ) {}
}
