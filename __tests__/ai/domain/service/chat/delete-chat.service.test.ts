import { Test } from '@nestjs/testing';
import { DeleteChatService } from '../../../../../src/ai/domain/service/chat/delete-chat.service';
import { ChatRepositoryInterface } from '../../../../../src/ai/domain/model/chat/chat.repository.interface';
import { DeleteChatCommand } from '../../../../../src/ai/application/command/chat/delete-chat.command';

describe('DeleteChatService', () => {
    let deleteChatService: DeleteChatService;
    let chatRepository: ChatRepositoryInterface;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                DeleteChatService,
                {
                    provide: 'ChatRepositoryInterface',
                    useValue: {
                        delete: jest.fn(),
                    },
                },
            ],
        }).compile();

        deleteChatService = moduleRef.get<DeleteChatService>(DeleteChatService);
        chatRepository = moduleRef.get<ChatRepositoryInterface>('ChatRepositoryInterface');
    });

    it('should delete a chat when valid command is provided', async () => {
        const command = new DeleteChatCommand('1');
        jest.spyOn(chatRepository, 'delete').mockResolvedValue(undefined);

        await deleteChatService.invoke(command);

        expect(chatRepository.delete).toHaveBeenCalledWith(command.id);
    });

    it('should throw an error when deleting chat fails', async () => {
        const command = new DeleteChatCommand('1');
        jest.spyOn(chatRepository, 'delete').mockRejectedValue(new Error('Delete error'));

        await expect(deleteChatService.invoke(command)).rejects.toThrow('Delete error');
        expect(chatRepository.delete).toHaveBeenCalledWith(command.id);
    });
});
