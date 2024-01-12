import { ChatMessageDto } from '../../../../../src/ai/application/query/chat/dto/chat-message.dto';

describe('ChatMessageDto', () => {
    it('should create a ChatMessageDto with all fields', () => {
        const chatMessageDto = new ChatMessageDto('1', 'Test message', 'human', new Date('2022-01-01T00:00:00Z'));

        expect(chatMessageDto.id).toEqual('1');
        expect(chatMessageDto.message).toEqual('Test message');
        expect(chatMessageDto.type).toEqual('human');
        expect(chatMessageDto.createdAt).toEqual(new Date('2022-01-01T00:00:00Z'));
    });

    it('should create a ChatMessageDto with different fields', () => {
        const chatMessageDto = new ChatMessageDto('2', 'Another message', 'ai', new Date('2023-01-01T00:00:00Z'));

        expect(chatMessageDto.id).toEqual('2');
        expect(chatMessageDto.message).toEqual('Another message');
        expect(chatMessageDto.type).toEqual('ai');
        expect(chatMessageDto.createdAt).toEqual(new Date('2023-01-01T00:00:00Z'));
    });
});
