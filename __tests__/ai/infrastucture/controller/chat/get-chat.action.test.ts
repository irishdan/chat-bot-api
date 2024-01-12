import { Test } from '@nestjs/testing';
import { QueryBus } from '@nestjs/cqrs';
import { GetChatAction } from '../../../../../src/ai/infrastructure/controller/chat/get-chat.action';
import { ChatResponseDto } from '../../../../../src/ai/application/query/chat/dto/chat.response-dto';
import { GetChatQuery } from '../../../../../src/ai/application/query/chat/get-chat.query';
import { ChatDto } from '../../../../../src/ai/application/query/chat/dto/chat.dto';

describe('GetChatAction', () => {
    let getChatAction: GetChatAction;
    let queryBus: QueryBus;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                GetChatAction,
                {
                    provide: QueryBus,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        getChatAction = moduleRef.get<GetChatAction>(GetChatAction);
        queryBus = moduleRef.get<QueryBus>(QueryBus);
    });

    it('should return chat when chat exists', async () => {
        const chatResponseDto: ChatResponseDto = {
            item: new ChatDto('1', 'test chat', undefined, 0),
        };
        jest.spyOn(queryBus, 'execute').mockResolvedValue(chatResponseDto);

        const result = await getChatAction.invoke('1');

        expect(queryBus.execute).toHaveBeenCalledWith(new GetChatQuery('1'));
        expect(result).toEqual(chatResponseDto);
    });

    it('should throw an error when chat does not exist', async () => {
        jest.spyOn(queryBus, 'execute').mockRejectedValue(new Error('Chat not found'));

        await expect(getChatAction.invoke('1')).rejects.toThrow('Chat not found');
        expect(queryBus.execute).toHaveBeenCalledWith(new GetChatQuery('1'));
    });
});
