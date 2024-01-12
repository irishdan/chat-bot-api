import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { ListChatMessagesAction } from '../../../../../src/ai/infrastructure/controller/chat/list-chat-messages.action';

describe('ListChatMessagesAction', () => {
    let listChatIdMessagesAction: ListChatMessagesAction;
    let queryBus: QueryBus;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                ListChatMessagesAction,
                {
                    provide: QueryBus,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        listChatIdMessagesAction = moduleRef.get<ListChatMessagesAction>(ListChatMessagesAction);
        queryBus = moduleRef.get<QueryBus>(QueryBus);
    });

    describe('invoke', () => {
        it('should return chat messages and pagination meta when query is successful', async () => {
            const query = { page: 1, perPage: 10 };
            jest.spyOn(queryBus, 'execute').mockResolvedValue({
                items: [],
                meta: { pagination: { totalItems: 0, totalPages: 0, page: 1, perPage: 10 } },
            });

            const result = await listChatIdMessagesAction.invoke('1', query);

            expect(result).toHaveProperty('items');
            expect(result).toHaveProperty('meta');
            expect(result.meta.pagination.totalItems).toBe(0);
        });

        it('should return chat messages and pagination meta with correct totalItems when there are messages', async () => {
            const query = { page: 1, perPage: 10 };
            jest.spyOn(queryBus, 'execute').mockResolvedValue({
                items: [{ dto: {} }],
                meta: { pagination: { totalItems: 1, totalPages: 1, page: 1, perPage: 10 } },
            });

            const result = await listChatIdMessagesAction.invoke('1', query);

            expect(result).toHaveProperty('items');
            expect(result).toHaveProperty('meta');
            expect(result.meta.pagination.totalItems).toBe(1);
        });

        it('should throw an error when execute method fails', async () => {
            const query = { page: 1, perPage: 10 };
            jest.spyOn(queryBus, 'execute').mockImplementation(() => Promise.reject(new Error()));

            await expect(listChatIdMessagesAction.invoke('1', query)).rejects.toThrow(Error);
        });
    });
});
