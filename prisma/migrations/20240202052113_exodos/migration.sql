/*
  Warnings:

  - You are about to drop the `ProfClasse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfClasse" DROP CONSTRAINT "ProfClasse_classeId_fkey";

-- DropForeignKey
ALTER TABLE "ProfClasse" DROP CONSTRAINT "ProfClasse_profId_fkey";

-- DropTable
DROP TABLE "ProfClasse";

-- CreateTable
CREATE TABLE "ProfClasseLycee" (
    "id" SERIAL NOT NULL,
    "profId" INTEGER NOT NULL,
    "classeId" INTEGER NOT NULL,
    "lyceeId" INTEGER NOT NULL,

    CONSTRAINT "ProfClasseLycee_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfClasseLycee" ADD CONSTRAINT "ProfClasseLycee_profId_fkey" FOREIGN KEY ("profId") REFERENCES "Prof"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfClasseLycee" ADD CONSTRAINT "ProfClasseLycee_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfClasseLycee" ADD CONSTRAINT "ProfClasseLycee_lyceeId_fkey" FOREIGN KEY ("lyceeId") REFERENCES "Lycee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
