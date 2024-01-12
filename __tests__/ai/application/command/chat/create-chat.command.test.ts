import * as dayjs from 'dayjs';
import { CreateChatRequest } from '../../../../../src/ai/infrastructure/controller/chat/request/create-chat.request';
import { CreateChatCommand } from '../../../../../src/ai/application/command/chat/create-chat.command';

describe('CreateChatCommand', () => {
    it('should create a command from request with all fields', () => {
        const id = '1';
        const dto: CreateChatRequest = {
            title: 'Title',
        };

        const command = CreateChatCommand.fromRequest(id, dto);

        expect(command.id).toEqual(id);
        expect(command.title).toEqual('Title');
    });
});
