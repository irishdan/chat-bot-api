import { Test } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateChatAction } from '../../../../../src/ai/infrastructure/controller/chat/create-chat.action';
import { CreateChatRequest } from '../../../../../src/ai/infrastructure/controller/chat/request/create-chat.request';
import { CreateChatCommand } from '../../../../../src/ai/application/command/chat/create-chat.command';
import { GetChatQuery } from '../../../../../src/ai/application/query/chat/get-chat.query';

describe('CreateChatAction', () => {
    let createChatAction: CreateChatAction;
    let commandBus: CommandBus;
    let queryBus: QueryBus;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CreateChatAction,
                {
                    provide: CommandBus,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
                {
                    provide: QueryBus,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        createChatAction = moduleRef.get<CreateChatAction>(CreateChatAction);
        commandBus = moduleRef.get<CommandBus>(CommandBus);
        queryBus = moduleRef.get<QueryBus>(QueryBus);
    });

    it('should create a chat and return the created chat', async () => {
        const dto: CreateChatRequest = { title: 'Chat title' };
        const chat = { id: '1', messages: [] };

        jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);
        jest.spyOn(queryBus, 'execute').mockResolvedValue(chat);

        const result = await createChatAction.invoke(dto);

        expect(commandBus.execute).toHaveBeenCalledWith(expect.any(CreateChatCommand));
        expect(queryBus.execute).toHaveBeenCalledWith(expect.any(GetChatQuery));
        expect(result).toEqual(chat);
    });

    it('should throw an error when command execution fails', async () => {
        const dto: CreateChatRequest = { title: 'Chat title' };

        jest.spyOn(commandBus, 'execute').mockRejectedValue(new Error('Command error'));

        await expect(createChatAction.invoke(dto)).rejects.toThrow('Command error');
        expect(commandBus.execute).toHaveBeenCalledWith(expect.any(CreateChatCommand));
    });

    it('should throw an error when query execution fails', async () => {
        const dto: CreateChatRequest = { title: 'Chat title' };

        jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);
        jest.spyOn(queryBus, 'execute').mockRejectedValue(new Error('Query error'));

        await expect(createChatAction.invoke(dto)).rejects.toThrow('Query error');
        expect(commandBus.execute).toHaveBeenCalledWith(expect.any(CreateChatCommand));
        expect(queryBus.execute).toHaveBeenCalledWith(expect.any(GetChatQuery));
    });
});
