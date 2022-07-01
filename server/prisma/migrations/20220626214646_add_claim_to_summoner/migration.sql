/*
  Warnings:

  - Added the required column `isClaimed` to the `Summoner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Summoner" ADD COLUMN     "isClaimed" BOOLEAN NOT NULL;
