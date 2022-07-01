/*
  Warnings:

  - You are about to drop the column `roles` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `roles` on the `Summoner` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "scrimId" INTEGER,
    "primaryRole" TEXT,
    "secondaryRole" TEXT,
    CONSTRAINT "Team_scrimId_fkey" FOREIGN KEY ("scrimId") REFERENCES "Scrim" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("id", "name", "scrimId") SELECT "id", "name", "scrimId" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE TABLE "new_Summoner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "icon" INTEGER NOT NULL,
    "primaryRole" TEXT,
    "secondaryRole" TEXT,
    "userId" INTEGER,
    CONSTRAINT "Summoner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Summoner" ("icon", "id", "level", "name", "rank", "userId") SELECT "icon", "id", "level", "name", "rank", "userId" FROM "Summoner";
DROP TABLE "Summoner";
ALTER TABLE "new_Summoner" RENAME TO "Summoner";
CREATE UNIQUE INDEX "Summoner_userId_key" ON "Summoner"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
