import { Prisma } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import BaseRepositoryPrisma from '../../../../../common/infrastructure/persistence/prisma/BaseRepositoryPrisma';
import { ChatRepositoryInterface } from '../../../../domain/model/chat/ChatRepositoryInterface';
import { ChatModel } from '../../../../domain/model/chat/ChatModel';
import { ChatMessageModel } from '../../../../domain/model/chat/ChatMessageModel';

type ChatWithMessageCount = Prisma.ChatGetPayload<{
    include: { _count: { select: { messages: true } } };
}>;
type ChatWithMessages = Prisma.ChatGetPayload<{
    include: { messages: true };
}>;

@Injectable()
export class ChatRepositoryPrisma extends BaseRepositoryPrisma implements ChatRepositoryInterface {
    constructor() {
        super();
    }

    protected modelFromPrisma(prismaChat: ChatWithMessageCount | ChatWithMessages): ChatModel {
        let data: object = prismaChat;
        if ('_count' in prismaChat) {
            data = { ...prismaChat, messageCount: prismaChat._count.messages };
        }

        return plainToInstance(ChatModel, data, { excludePrefixes: ['_'] });
    }

    async persist(chat: ChatModel): Promise<ChatModel> {
        return await this.saveAndPublish<ChatModel>(chat, async (chat) => {
            // update
            const newMessages = [];
            if (chat.messages) {
                for (let i = 0; i < chat.messages.length; i++) {
                    if (!chat.messages[i].internalId) {
                        newMessages.push({
                            id: chat.messages[i].id, // @TODO: Fix this in project
                            message: chat.messages[i].message,
                            type: chat.messages[i].type,
                            createdAt: chat.messages[i].createdAt.toDate(),
                            promptMessageId: chat.messages[i].promptMessageId,
                        });
                    }
                }
            }

            if (chat.internalId) {
                const data = {
                    title: chat.title,
                    messages: {
                        create: newMessages,
                    },
                };

                await this.prisma.chat.update({
                    where: { id: chat.id },
                    data,
                    include: {
                        messages: true,
                    },
                });
            }
            // create
            else {
                const prismaChat = await this.prisma.chat.create({
                    data: {
                        id: chat.id,
                        title: chat.title,
                        createdAt: chat.createdAt.toDate(),
                        messages: {
                            create: chat.messages
                                ? chat.messages.map((message) => {
                                      return {
                                          id: message.id,
                                          message: message.message,
                                          type: message.type,
                                          createdAt: chat.createdAt.toDate(),
                                          promptMessageId: message.promptMessageId,
                                      };
                                  })
                                : [],
                        },
                    },
                });

                chat.internalId = prismaChat.internalId;
            }

            chat.messages.forEach((message) => {
                message.chatId = chat.id;
                this.cache.set(message.dto); // @TODO: Fix in project
            });

            return chat;
        });
    }

    async findById(id: string): Promise<ChatModel> {
        const chat = await this.prisma.chat.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { messages: true },
                },
            },
        });

        if (!chat) {
            throw new NotFoundException('Chat not found');
        }

        return this.modelFromPrisma(chat);
    }

    async list(page: number, perPage: number): Promise<ChatModel[]> {
        const chats = await this.prisma.chat.findMany({
            orderBy: [
                {
                    createdAt: 'desc',
                },
            ],
            include: {
                _count: {
                    select: { messages: true },
                },
            },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return chats.map((chat) => {
            return this.modelFromPrisma(chat);
        });
    }

    async listIds(page: number, perPage: number): Promise<string[]> {
        const chats = await this.prisma.chat.findMany({
            orderBy: [
                {
                    createdAt: 'desc',
                },
            ],
            select: { id: true },
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return chats.map((chat) => chat.id);
    }

    async count(): Promise<number> {
        return this.prisma.chat.count();
    }

    async delete(id: string): Promise<void> {
        await this.prisma.chat.delete({ where: { id } });
    }

    async findChatMessageById(id: string): Promise<ChatMessageModel> {
        const rawResult = await this.prisma.$queryRaw`
            SELECT cm.id, c.id as "chatId", cm.type, cm.message, cm."createdAt", cm."promptMessageId"  FROM chat_messages AS cm
            JOIN chats AS c ON c."internalId" = cm."chatInternalId"
            WHERE cm.id = ${id}`;

        if (!rawResult[0]) {
            throw new NotFoundException(`ChatMessage not found with id ${id}`);
        }

        return plainToInstance(ChatMessageModel, rawResult[0]);
    }

    async findChatMessageIdByPromptMessageId(id: string): Promise<string | undefined> {
        const rawResult = await this.prisma.$queryRaw`
            SELECT cm.id FROM chat_messages AS cm
            WHERE cm."promptMessageId" = ${id}`;

        if (!rawResult[0]) {
            return;
        }

        return rawResult[0]['id'];
    }

    async listChatMessageIds(chatId: string, page: number, perPage: number, sort?: 'asc' | 'desc'): Promise<string[]> {
        if (!sort) {
            sort = 'desc';
        }

        const direction = Prisma.sql([sort]);
        const rawResult: object[] = await this.prisma.$queryRaw`
            SELECT cm.id FROM chat_messages AS cm
            JOIN chats AS c ON c."internalId" = cm."chatInternalId"
            WHERE c.id = ${chatId}
            ORDER BY cm."createdAt" ${direction}
            OFFSET ${(page - 1) * perPage} LIMIT ${perPage}
        `;

        return rawResult.map((message) => message['id']);
    }

    async listChatMessages(
        chatId: string,
        page: number,
        perPage: number,
        sort?: 'asc' | 'desc',
    ): Promise<ChatMessageModel[]> {
        if (!sort) {
            sort = 'desc';
        }

        const direction = Prisma.sql([sort]);
        const rawResult: object[] = await this.prisma.$queryRaw`
            SELECT cm.id, c.id as "chatId", cm.type, cm.message, cm."createdAt", cm."promptMessageId" FROM chat_messages AS cm
            JOIN chats AS c ON c."internalId" = cm."chatInternalId"
            WHERE c.id = ${chatId}
            OFFSET ${(page - 1) * perPage}
            LIMIT ${perPage}
            ORDER BY cm."createdAt" ${direction}
        `;

        return rawResult.map((message) => plainToInstance(ChatMessageModel, message));
    }

    async countChatMessages(chatId: string): Promise<number> {
        const rawCount = await this.prisma.$queryRaw`
            SELECT CAST(COUNT(*) as INTEGER) FROM chat_messages AS cm
            JOIN chats AS c ON c."internalId" = cm."chatInternalId"
            WHERE c.id = ${chatId}
        `;

        return rawCount[0]['count'];
    }
}
