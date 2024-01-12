export class ListChatsQuery {
    constructor(
        public readonly page?: number,
        public readonly perPage?: number,
    ) {}
}
