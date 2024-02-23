/*
  Warnings:

  - You are about to drop the column `receiver_id` on the `chat_messages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "chat_messages" DROP CONSTRAINT "chat_messages_receiver_id_fkey";

-- AlterTable
ALTER TABLE "chat_messages" DROP COLUMN "receiver_id";
