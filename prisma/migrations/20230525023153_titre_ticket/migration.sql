/*
  Warnings:

  - You are about to drop the column `type` on the `Ticket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Statu_user_ticket" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "type",
ADD COLUMN     "titre" TEXT NOT NULL DEFAULT 'titre';
