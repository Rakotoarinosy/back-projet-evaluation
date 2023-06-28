-- CreateTable
CREATE TABLE "Solution" (
    "id" SERIAL NOT NULL,
    "contenu" TEXT NOT NULL,

    CONSTRAINT "Solution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketSolution" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "solutionId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketSolution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketSolution" ADD CONSTRAINT "TicketSolution_solutionId_fkey" FOREIGN KEY ("solutionId") REFERENCES "Solution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketSolution" ADD CONSTRAINT "TicketSolution_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
