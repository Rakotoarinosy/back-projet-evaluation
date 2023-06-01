/*
  Warnings:

  - You are about to drop the column `user` on the `Conversation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "user",
ADD COLUMN     "membre" INTEGER[];
