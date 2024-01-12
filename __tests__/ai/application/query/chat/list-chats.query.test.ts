import { ListChatsQuery } from '../../../../../src/ai/application/query/chat/list-chats.query';

describe('ListChatsQuery', () => {
    it('should create a query with userId, page, and perPage', () => {
        const page = 2;
        const perPage = 10;

        const query = new ListChatsQuery(page, perPage);

        expect(query.page).toEqual(page);
        expect(query.perPage).toEqual(perPage);
    });

    it('should create a query with default values', () => {
        const query = new ListChatsQuery();

        expect(query.page).toBeUndefined();
        expect(query.perPage).toBeUndefined();
    });

    it('should create a query with different page, and perPage', () => {
        const page = 3;
        const perPage = 20;

        const query = new ListChatsQuery(page, perPage);

        expect(query.page).toEqual(page);
        expect(query.perPage).toEqual(perPage);
    });
});
