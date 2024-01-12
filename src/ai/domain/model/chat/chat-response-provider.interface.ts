import { ChatMessageModel } from './chat-message.model';

export default interface ChatResponseProviderInterface {
    promptForResponse(chatId: string, prompts: ChatMessageModel[]): Promise<ChatMessageModel | null>;
}
