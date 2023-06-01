-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "statuId" INTEGER NOT NULL DEFAULT 4;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_statuId_fkey" FOREIGN KEY ("statuId") REFERENCES "Statu"("st_id") ON DELETE RESTRICT ON UPDATE CASCADE;
