/*
  Warnings:

  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTicket` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_roleId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_statuId_fkey";

-- DropForeignKey
ALTER TABLE "UserRole" DROP CONSTRAINT "UserRole_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserTicket" DROP CONSTRAINT "UserTicket_statuId_fkey";

-- DropForeignKey
ALTER TABLE "UserTicket" DROP CONSTRAINT "UserTicket_ticketId_fkey";

-- DropForeignKey
ALTER TABLE "UserTicket" DROP CONSTRAINT "UserTicket_userId_fkey";

-- DropTable
DROP TABLE "UserRole";

-- DropTable
DROP TABLE "UserTicket";

-- CreateTable
CREATE TABLE "Statu_user_role" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "statuId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Statu_user_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statu_user_ticket" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "statuId" INTEGER NOT NULL,

    CONSTRAINT "Statu_user_ticket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Statu_user_role" ADD CONSTRAINT "Statu_user_role_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statu_user_role" ADD CONSTRAINT "Statu_user_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statu_user_role" ADD CONSTRAINT "Statu_user_role_statuId_fkey" FOREIGN KEY ("statuId") REFERENCES "Statu"("st_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statu_user_ticket" ADD CONSTRAINT "Statu_user_ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statu_user_ticket" ADD CONSTRAINT "Statu_user_ticket_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statu_user_ticket" ADD CONSTRAINT "Statu_user_ticket_statuId_fkey" FOREIGN KEY ("statuId") REFERENCES "Statu"("st_id") ON DELETE RESTRICT ON UPDATE CASCADE;
