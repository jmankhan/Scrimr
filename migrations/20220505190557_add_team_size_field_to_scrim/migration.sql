-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Scrim" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "step" TEXT NOT NULL DEFAULT 'pool',
    "hostId" INTEGER NOT NULL,
    "firstDraftId" INTEGER,
    "sidePickId" INTEGER,
    "teamSize" INTEGER NOT NULL DEFAULT 5,
    "autoDraft" BOOLEAN NOT NULL DEFAULT false,
    "autoBalance" BOOLEAN NOT NULL DEFAULT false,
    "isPrivate" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Scrim_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Scrim" ("autoBalance", "autoDraft", "createdDate", "firstDraftId", "hostId", "id", "isPrivate", "sidePickId", "step") SELECT "autoBalance", "autoDraft", "createdDate", "firstDraftId", "hostId", "id", "isPrivate", "sidePickId", "step" FROM "Scrim";
DROP TABLE "Scrim";
ALTER TABLE "new_Scrim" RENAME TO "Scrim";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
