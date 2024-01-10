import { ChatMessageModel } from './ChatMessageModel';

export default interface ChatResponseProviderInterface {
    promptForResponse(chatId: string, prompts: ChatMessageModel[]): Promise<ChatMessageModel | null>;
}
