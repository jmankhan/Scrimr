/*
  Warnings:

  - You are about to drop the column `primaryRole` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `secondaryRole` on the `Team` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "primaryRole",
DROP COLUMN "secondaryRole";
