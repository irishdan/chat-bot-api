import { BufferMemory, ChatMessageHistory, ConversationSummaryBufferMemory } from 'langchain/memory';
import { ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder } from 'langchain/prompts';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BaseMessage } from '@langchain/core/dist/messages';
import { ConversationChain } from 'langchain/chains';
import { randomUUID } from 'crypto';
import { CallbackHandlerMethods } from '@langchain/core/dist/callbacks/base';

export class OpenAiStatelessChatPrompter {
    constructor(private openApiKey: string) {}

    async prompt(
        prompt: string,
        history: BaseMessage[],
        memoryType: 'Buffer' | 'ConversationSummaryBuffer',
        streaming: boolean,
        handleLLMNewTokenCallbacks?: ((token: string) => void)[],
        modelName?: string,
    ): Promise<{ responseId: string; response: string } | null> {
        let responseId: string = randomUUID();
        const chatHistory = new ChatMessageHistory(history);
        const chatPrompt = ChatPromptTemplate.fromMessages([
            new MessagesPlaceholder('history'),
            HumanMessagePromptTemplate.fromTemplate('{input}'),
        ]);

        const callbacks: CallbackHandlerMethods[] = [
            {
                handleLLMEnd: (output, runId) => {
                    responseId = runId;
                },
            },
        ];

        if (handleLLMNewTokenCallbacks) {
            handleLLMNewTokenCallbacks.map((callback) => {
                callbacks.push({ handleLLMNewToken: callback });
            });
        }

        const chatAi = new ChatOpenAI({
            openAIApiKey: this.openApiKey,
            modelName: modelName,
            streaming: streaming,
            callbacks,
        });

        const buffer =
            memoryType === 'Buffer'
                ? new BufferMemory({
                      returnMessages: true,
                      memoryKey: 'history',
                      chatHistory,
                  })
                : new ConversationSummaryBufferMemory({
                      returnMessages: true,
                      memoryKey: 'history',
                      chatHistory,
                      llm: chatAi,
                  });

        const chain = new ConversationChain({
            prompt: chatPrompt,
            llm: chatAi,
            memory: buffer,
        });

        const result = await chain.call({ input: prompt });

        return {
            responseId: responseId,
            response: result.response,
        };
    }
}
