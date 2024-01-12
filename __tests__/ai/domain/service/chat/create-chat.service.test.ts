import { Test } from '@nestjs/testing';
import { CreateChatService } from '../../../../../src/ai/domain/service/chat/create-chat.service';
import { ChatRepositoryInterface } from '../../../../../src/ai/domain/model/chat/chat.repository.interface';
import { ChatModel } from '../../../../../src/ai/domain/model/chat/chat.model';


describe('CreateChatService', () => {
    let createChatService: CreateChatService;
    let chatRepository: ChatRepositoryInterface;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            providers: [
                CreateChatService,
                {
                    provide: 'ChatRepositoryInterface',
                    useValue: {
                        persist: jest.fn(),
                    },
                },
            ],
        }).compile();

        createChatService = moduleRef.get<CreateChatService>(CreateChatService);
        chatRepository = moduleRef.get<ChatRepositoryInterface>('ChatRepositoryInterface');
    });

    it('should create a chat without messages', async () => {
        await createChatService.invoke('id1', 'title');

        expect(chatRepository.persist).toHaveBeenCalledWith(expect.any(ChatModel));
    });

    it('should throw an error when persisting chat fails', async () => {
        jest.spyOn(chatRepository, 'persist').mockRejectedValue(new Error('Persist error'));

        await expect(createChatService.invoke('id1', 'title')).rejects.toThrow('Persist error');
        expect(chatRepository.persist).toHaveBeenCalledWith(expect.any(ChatModel));
    });
});
