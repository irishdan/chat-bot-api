import * as dayjs from 'dayjs';
import { ChatModel } from '../../../../../src/ai/domain/model/chat/chat.model';
import { ChatMessageModel } from '../../../../../src/ai/domain/model/chat/chat-message.model';

describe('ChatModel', () => {
    it('should create a chat with id, userId and createdAt', () => {
        const chat = ChatModel.create('1', '1', dayjs());

        expect(chat.id).toEqual('1');
    });

    it('should add a message to chat', () => {
        const chat = ChatModel.create('1', '1', dayjs());
        chat.addMessage(new ChatMessageModel('1', 'Test message', 'human', dayjs()));

        expect(chat.messages.length).toEqual(1);
        expect(chat.messages[0].id).toEqual('1');
        expect(chat.messages[0].type).toEqual('human');
        expect(chat.messages[0].message).toEqual('Test message');
    });

    it('should return dto', () => {
        const chat = ChatModel.create('1', 'some title', dayjs());

        const dto = chat.dto;

        expect(dto.id).toEqual('1');
        expect(dto.title).toEqual('some title');
    });
});
