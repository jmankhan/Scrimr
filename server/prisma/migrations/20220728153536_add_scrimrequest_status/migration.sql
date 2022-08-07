/*
  Warnings:

  - Added the required column `status` to the `ScrimRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScrimRequest" ADD COLUMN     "status" TEXT NOT NULL;
