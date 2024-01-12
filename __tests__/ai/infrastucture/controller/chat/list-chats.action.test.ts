import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { ListChatsAction } from '../../../../../src/ai/infrastructure/controller/chat/list-chats.action';

describe('ListChatsAction', () => {
    let listChatsAction: ListChatsAction;
    let queryBus: QueryBus;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ListChatsAction,
                {
                    provide: QueryBus,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        listChatsAction = moduleRef.get<ListChatsAction>(ListChatsAction);
        queryBus = moduleRef.get<QueryBus>(QueryBus);
    });

    describe('invoke', () => {
        it('should return chats and pagination meta when query is successful', async () => {
            const query = { page: 1, perPage: 10 };
            jest.spyOn(queryBus, 'execute').mockResolvedValue({
                items: [],
                meta: { pagination: { totalItems: 0, totalPages: 0, page: 1, perPage: 10 } },
            });

            const result = await listChatsAction.invoke(query);

            expect(queryBus.execute).toBeCalledWith(expect.anything());
            expect(result).toHaveProperty('items');
            expect(result).toHaveProperty('meta');
            expect(result.meta.pagination.totalItems).toBe(0);
        });

        it('should throw an error when execute method fails', async () => {
            const query = { page: 1, perPage: 10 };
            jest.spyOn(queryBus, 'execute').mockImplementation(() => Promise.reject(new Error()));

            await expect(listChatsAction.invoke(query)).rejects.toThrow(Error);
        });
    });
});
