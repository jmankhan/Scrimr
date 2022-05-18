-- CreateTable
CREATE TABLE "Member" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "roles" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_username_key" ON "Member"("username");
