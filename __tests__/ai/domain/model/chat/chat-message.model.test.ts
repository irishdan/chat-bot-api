import * as dayjs from 'dayjs';
import { ChatMessageModel } from '../../../../../src/ai/domain/model/chat/chat-message.model';

describe('ChatMessageModel', () => {
    it('should create a chat message with id, message, type and createdAt', () => {
        const chatMessage = new ChatMessageModel('1', 'Test message', 'human', dayjs());

        expect(chatMessage.id).toEqual('1');
        expect(chatMessage.message).toEqual('Test message');
        expect(chatMessage.type).toEqual('human');
    });

    it('should create a chat message with different id, message, type and createdAt', () => {
        const chatMessage = new ChatMessageModel('2', 'Another message', 'ai', dayjs().add(1, 'day'));

        expect(chatMessage.id).toEqual('2');
        expect(chatMessage.message).toEqual('Another message');
        expect(chatMessage.type).toEqual('ai');
    });

    it('should return dto', () => {
        const chatMessage = new ChatMessageModel('1', 'Test message', 'human', dayjs());

        const dto = chatMessage.dto;

        expect(dto.id).toEqual('1');
        expect(dto.message).toEqual('Test message');
        expect(dto.type).toEqual('human');
    });
});
