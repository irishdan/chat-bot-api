import { Test } from '@nestjs/testing';
import { UpdateChatCommandHandler } from '../../../../../src/ai/application/command/chat/update-chat.command-handler';
import { UpdateChatService } from '../../../../../src/ai/domain/service/chat/update-chat.service';
import { UpdateChatCommand } from '../../../../../src/ai/application/command/chat/update-chat.command';

describe('UpdateChatCommandHandler', () => {
    let updateChatCommandHandler: UpdateChatCommandHandler;
    let updateChatService: UpdateChatService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                UpdateChatCommandHandler,
                {
                    provide: UpdateChatService,
                    useValue: {
                        invoke: jest.fn(),
                    },
                },
            ],
        }).compile();

        updateChatCommandHandler = moduleRef.get<UpdateChatCommandHandler>(UpdateChatCommandHandler);
        updateChatService = moduleRef.get<UpdateChatService>(UpdateChatService);
    });

    it('should update a chat when valid command is provided', async () => {
        const command = new UpdateChatCommand('1', 'updated title');
        jest.spyOn(updateChatService, 'invoke').mockResolvedValue(undefined);

        await updateChatCommandHandler.execute(command);

        expect(updateChatService.invoke).toHaveBeenCalledWith(command.id, command.title);
    });

    it('should throw an error when service throws an error', async () => {
        const command = new UpdateChatCommand('1', 'updated title');
        jest.spyOn(updateChatService, 'invoke').mockRejectedValue(new Error('Service error'));

        await expect(updateChatCommandHandler.execute(command)).rejects.toThrow('Service error');
        expect(updateChatService.invoke).toHaveBeenCalledWith(command.id, command.title);
    });
});
