/*
  Warnings:

  - You are about to drop the column `autoBalance` on the `Scrim` table. All the data in the column will be lost.
  - You are about to drop the column `autoDraft` on the `Scrim` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Scrim" DROP COLUMN "autoBalance",
DROP COLUMN "autoDraft",
ADD COLUMN     "mode" TEXT NOT NULL DEFAULT E'manual';
