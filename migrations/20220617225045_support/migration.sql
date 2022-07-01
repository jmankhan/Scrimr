/*
  Warnings:

  - You are about to drop the column `coinflipWinner` on the `Scrim` table. All the data in the column will be lost.
  - You are about to drop the column `firstDraftId` on the `Scrim` table. All the data in the column will be lost.
  - You are about to drop the column `sidePickId` on the `Scrim` table. All the data in the column will be lost.
  - You are about to drop the column `sideSelection` on the `Scrim` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scrim" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "autoDraft" BOOLEAN NOT NULL DEFAULT false,
    "autoBalance" BOOLEAN NOT NULL DEFAULT false,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "draftOrder" TEXT,
    "hostId" INTEGER NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    "sideOrder" TEXT,
    "step" TEXT NOT NULL DEFAULT 'pool',
    "teamSize" INTEGER NOT NULL DEFAULT 5,
    CONSTRAINT "Scrim_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scrim" ("autoBalance", "autoDraft", "createdDate", "hostId", "id", "isPrivate", "step", "teamSize") SELECT "autoBalance", "autoDraft", "createdDate", "hostId", "id", "isPrivate", "step", "teamSize" FROM "Scrim";
DROP TABLE "Scrim";
ALTER TABLE "new_Scrim" RENAME TO "Scrim";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
