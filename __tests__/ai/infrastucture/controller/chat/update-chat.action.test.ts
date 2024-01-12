import { Test } from '@nestjs/testing';
import { UpdateChatAction } from '../../../../../src/ai/infrastructure/controller/chat/update-chat.action';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UpdateChatRequest } from '../../../../../src/ai/infrastructure/controller/chat/request/update-chat.request';
import { ChatResponseDto } from '../../../../../src/ai/application/query/chat/dto/chat.response-dto';
import { UpdateChatCommand } from '../../../../../src/ai/application/command/chat/update-chat.command';
import { GetChatQuery } from '../../../../../src/ai/application/query/chat/get-chat.query';
import { ChatDto } from '../../../../../src/ai/application/query/chat/dto/chat.dto';

describe('UpdateChatAction', () => {
    let updateChatAction: UpdateChatAction;
    let commandBus: CommandBus;
    let queryBus: QueryBus;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UpdateChatAction,
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

        updateChatAction = moduleRef.get<UpdateChatAction>(UpdateChatAction);
        commandBus = moduleRef.get<CommandBus>(CommandBus);
        queryBus = moduleRef.get<QueryBus>(QueryBus);
    });

    it('should update a chat and return the updated chat', async () => {
        const id = '1';
        const requestDto: UpdateChatRequest = { title: 'New Title' };
        const chatResponseDto: ChatResponseDto = {
            item: new ChatDto('1', 'Title', undefined, 0),
        };

        jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);
        jest.spyOn(queryBus, 'execute').mockResolvedValue(chatResponseDto);

        const result = await updateChatAction.invoke(id, requestDto);

        expect(commandBus.execute).toHaveBeenCalledWith(expect.any(UpdateChatCommand));
        expect(queryBus.execute).toHaveBeenCalledWith(new GetChatQuery(id));
        expect(result).toEqual(chatResponseDto);
    });

    it('should throw an error when command execution fails', async () => {
        const id = '1';
        const requestDto: UpdateChatRequest = { title: 'New Title' };

        jest.spyOn(commandBus, 'execute').mockRejectedValue(new Error('Command error'));

        await expect(updateChatAction.invoke(id, requestDto)).rejects.toThrow('Command error');
        expect(commandBus.execute).toHaveBeenCalledWith(expect.any(UpdateChatCommand));
    });

    it('should throw an error when query execution fails', async () => {
        const id = '1';
        const requestDto: UpdateChatRequest = { title: 'New Title' };

        jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);
        jest.spyOn(queryBus, 'execute').mockRejectedValue(new Error('Query error'));

        await expect(updateChatAction.invoke(id, requestDto)).rejects.toThrow('Query error');
        expect(commandBus.execute).toHaveBeenCalledWith(expect.any(UpdateChatCommand));
        expect(queryBus.execute).toHaveBeenCalledWith(new GetChatQuery(id));
    });
});
