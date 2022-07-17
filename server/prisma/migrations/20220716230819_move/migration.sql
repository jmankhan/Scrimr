/*
  Warnings:

  - You are about to drop the column `draftOrder` on the `Scrim` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Scrim" DROP COLUMN "draftOrder";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "draftOrder" INTEGER DEFAULT -1;
