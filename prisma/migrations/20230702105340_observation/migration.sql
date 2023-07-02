-- CreateTable
CREATE TABLE "Observation" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,

    CONSTRAINT "Observation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketObservation" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "observationId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TicketObservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketObservation" ADD CONSTRAINT "TicketObservation_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "Observation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketObservation" ADD CONSTRAINT "TicketObservation_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
