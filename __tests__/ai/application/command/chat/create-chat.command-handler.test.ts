import { Test } from '@nestjs/testing';
import { CreateChatCommandHandler } from '../../../../../src/ai/application/command/chat/create-chat.command-handler';
import { CreateChatService } from '../../../../../src/ai/domain/service/chat/create-chat.service';
import { CreateChatCommand } from '../../../../../src/ai/application/command/chat/create-chat.command';

describe('CreateChatCommandHandler', () => {
    let createChatCommandHandler: CreateChatCommandHandler;
    let createChatService: CreateChatService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CreateChatCommandHandler,
                {
                    provide: CreateChatService,
                    useValue: {
                        invoke: jest.fn(),
                    },
                },
            ],
        }).compile();

        createChatCommandHandler = moduleRef.get<CreateChatCommandHandler>(CreateChatCommandHandler);
        createChatService = moduleRef.get<CreateChatService>(CreateChatService);
    });

    it('should create a chat when valid command is provided', async () => {
        const command = new CreateChatCommand('id1', 'test title');
        jest.spyOn(createChatService, 'invoke').mockResolvedValue(undefined);

        await createChatCommandHandler.execute(command);

        expect(createChatService.invoke).toHaveBeenCalledWith('id1', 'test title');
    });

    it('should throw an error when service throws an error', async () => {
        const command = new CreateChatCommand('id1', 'test title');
        jest.spyOn(createChatService, 'invoke').mockRejectedValue(new Error('Service error'));

        await expect(createChatCommandHandler.execute(command)).rejects.toThrow('Service error');
        expect(createChatService.invoke).toHaveBeenCalledWith('id1', 'test title');
    });
});
