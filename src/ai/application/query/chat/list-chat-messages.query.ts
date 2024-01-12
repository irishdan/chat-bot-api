export class ListChatMessagesQuery {
    constructor(
        public readonly id: string,
        public readonly page?: number,
        public readonly perPage?: number,
    ) {}
}
