export class ListChatIdMessagesQuery {
    constructor(
        public readonly id: string,
        public readonly page?: number,
        public readonly perPage?: number,
    ) {}
}
