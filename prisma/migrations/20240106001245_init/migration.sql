-- CreateTable
CREATE TABLE "chats" (
    "internalId" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "modelName" TEXT,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("internalId")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "internalId" SERIAL NOT NULL,
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatInternalId" INTEGER NOT NULL,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("internalId")
);

-- CreateIndex
CREATE UNIQUE INDEX "chats_id_key" ON "chats"("id");

-- CreateIndex
CREATE UNIQUE INDEX "chat_messages_id_key" ON "chat_messages"("id");

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chatInternalId_fkey" FOREIGN KEY ("chatInternalId") REFERENCES "chats"("internalId") ON DELETE CASCADE ON UPDATE CASCADE;
