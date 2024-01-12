import { Test } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteChatAction } from '../../../../../src/ai/infrastructure/controller/chat/delete-chat.action';
import { DeleteChatCommand } from '../../../../../src/ai/application/command/chat/delete-chat.command';

describe('DeleteChatAction', () => {
    let deleteChatAction: DeleteChatAction;
    let commandBus: CommandBus;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                DeleteChatAction,
                {
                    provide: CommandBus,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        deleteChatAction = moduleRef.get<DeleteChatAction>(DeleteChatAction);
        commandBus = moduleRef.get<CommandBus>(CommandBus);
    });

    it('should delete a chat when valid id is provided', async () => {
        const id = '1';
        jest.spyOn(commandBus, 'execute').mockResolvedValue(undefined);

        await deleteChatAction.invoke(id);

        expect(commandBus.execute).toHaveBeenCalledWith(new DeleteChatCommand(id));
    });

    it('should throw an error when command execution fails', async () => {
        const id = '1';
        jest.spyOn(commandBus, 'execute').mockRejectedValue(new Error('Command error'));

        await expect(deleteChatAction.invoke(id)).rejects.toThrow('Command error');
        expect(commandBus.execute).toHaveBeenCalledWith(new DeleteChatCommand(id));
    });
});
