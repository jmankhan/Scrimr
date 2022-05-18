-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Summoner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "level" INTEGER NOT NULL,
    "icon" INTEGER NOT NULL,
    "roles" TEXT,
    "userId" INTEGER,
    CONSTRAINT "Summoner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Summoner" ("icon", "id", "level", "name", "rank", "roles", "userId") SELECT "icon", "id", "level", "name", "rank", "roles", "userId" FROM "Summoner";
DROP TABLE "Summoner";
ALTER TABLE "new_Summoner" RENAME TO "Summoner";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
