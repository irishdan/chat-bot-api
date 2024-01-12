import { Test } from '@nestjs/testing';
import { DeleteChatCommandHandler } from '../../../../../src/ai/application/command/chat/delete-chat.command-handler';
import { DeleteChatService } from '../../../../../src/ai/domain/service/chat/delete-chat.service';
import { DeleteChatCommand } from '../../../../../src/ai/application/command/chat/delete-chat.command';

describe('DeleteChatCommandHandler', () => {
    let deleteChatCommandHandler: DeleteChatCommandHandler;
    let deleteChatService: DeleteChatService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                DeleteChatCommandHandler,
                {
                    provide: DeleteChatService,
                    useValue: {
                        invoke: jest.fn(),
                    },
                },
            ],
        }).compile();

        deleteChatCommandHandler = moduleRef.get<DeleteChatCommandHandler>(DeleteChatCommandHandler);
        deleteChatService = moduleRef.get<DeleteChatService>(DeleteChatService);
    });

    it('should delete a chat when valid command is provided', async () => {
        const command = new DeleteChatCommand('1');
        jest.spyOn(deleteChatService, 'invoke').mockResolvedValue(undefined);

        await deleteChatCommandHandler.execute(command);

        expect(deleteChatService.invoke).toHaveBeenCalledWith(command);
    });

    it('should throw an error when service throws an error', async () => {
        const command = new DeleteChatCommand('1');
        jest.spyOn(deleteChatService, 'invoke').mockRejectedValue(new Error('Service error'));

        await expect(deleteChatCommandHandler.execute(command)).rejects.toThrow('Service error');
        expect(deleteChatService.invoke).toHaveBeenCalledWith(command);
    });
});
