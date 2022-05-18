/*
  Warnings:

  - Added the required column `scrimId` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Scrim" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "step" TEXT NOT NULL DEFAULT 'pool',
    "hostId" INTEGER NOT NULL,
    "autoDraft" BOOLEAN NOT NULL DEFAULT false,
    "autoBalance" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Scrim_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "scrimId" INTEGER,
    CONSTRAINT "Team_scrimId_fkey" FOREIGN KEY ("scrimId") REFERENCES "Scrim" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Team" ("id", "name") SELECT "id", "name" FROM "Team";
DROP TABLE "Team";
ALTER TABLE "new_Team" RENAME TO "Team";
CREATE TABLE "new_Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "teamId" INTEGER NOT NULL,
    "summonerId" TEXT NOT NULL,
    "scrimId" INTEGER NOT NULL,
    CONSTRAINT "Member_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Member_summonerId_fkey" FOREIGN KEY ("summonerId") REFERENCES "Summoner" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Member_scrimId_fkey" FOREIGN KEY ("scrimId") REFERENCES "Scrim" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Member" ("createdDate", "id", "summonerId", "teamId") SELECT "createdDate", "id", "summonerId", "teamId" FROM "Member";
DROP TABLE "Member";
ALTER TABLE "new_Member" RENAME TO "Member";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
