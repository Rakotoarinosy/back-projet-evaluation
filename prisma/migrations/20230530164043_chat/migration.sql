-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "titre" SET DEFAULT 'Aucun titre';

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "user" INTEGER[],

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statu_conversation_ticket" (
    "id" SERIAL NOT NULL,
    "statuId" INTEGER NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Statu_conversation_ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statu_message_conversation" (
    "id" SERIAL NOT NULL,
    "statuId" INTEGER NOT NULL,
    "messageId" INTEGER NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Statu_message_conversation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Statu_conversation_ticket" ADD CONSTRAINT "Statu_conversation_ticket_statuId_fkey" FOREIGN KEY ("statuId") REFERENCES "Statu"("st_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statu_conversation_ticket" ADD CONSTRAINT "Statu_conversation_ticket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statu_conversation_ticket" ADD CONSTRAINT "Statu_conversation_ticket_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statu_message_conversation" ADD CONSTRAINT "Statu_message_conversation_statuId_fkey" FOREIGN KEY ("statuId") REFERENCES "Statu"("st_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statu_message_conversation" ADD CONSTRAINT "Statu_message_conversation_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statu_message_conversation" ADD CONSTRAINT "Statu_message_conversation_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
