import { ChatDto } from '../../../../../src/ai/application/query/chat/dto/chat.dto';

describe('ChatDto', () => {
    it('should create a ChatDto with all fields', () => {
        const chatDto = new ChatDto('1', 'Test summary', new Date('2022-01-01T00:00:00Z'), 10);

        expect(chatDto.id).toEqual('1');
        expect(chatDto.title).toEqual('Test summary');
        expect(chatDto.createdAt).toEqual(new Date('2022-01-01T00:00:00Z'));
        expect(chatDto.messageCount).toEqual(10);
    });
});
