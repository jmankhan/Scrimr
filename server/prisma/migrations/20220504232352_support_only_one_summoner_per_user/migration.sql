/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Summoner` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Summoner_userId_key" ON "Summoner"("userId");
