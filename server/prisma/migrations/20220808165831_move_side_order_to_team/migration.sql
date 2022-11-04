/*
  Warnings:

  - You are about to drop the column `sideOrder` on the `Scrim` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Scrim" DROP COLUMN "sideOrder";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "sideOrder" INTEGER DEFAULT -1;
