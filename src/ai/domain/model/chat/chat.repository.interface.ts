import { ChatModel } from './chat.model';
import { ChatMessageModel } from './chat-message.model';

export interface ChatRepositoryInterface {
    persist(chat: ChatModel): Promise<ChatModel>;

    list(page: number, perPage: number): Promise<ChatModel[]>;

    listIds(page: number, perPage: number): Promise<string[]>;

    count(): Promise<number>;

    findById(id: string): Promise<ChatModel>;

    delete(id: string): Promise<void>;

    findChatMessageById(id: string): Promise<ChatMessageModel>;

    findChatMessageIdByPromptMessageId(id: string): Promise<string | undefined>;

    listChatMessages(chatId: string, page: number, perPage: number, sort?: 'asc' | 'desc'): Promise<ChatMessageModel[]>;

    listChatMessageIds(chatId: string, page: number, perPage: number, sort?: 'asc' | 'desc'): Promise<string[]>;

    countChatMessages(chatId: string): Promise<number>;
}
