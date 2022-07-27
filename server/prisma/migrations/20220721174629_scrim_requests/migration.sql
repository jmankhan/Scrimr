-- CreateTable
CREATE TABLE "ScrimRequest" (
    "id" SERIAL NOT NULL,
    "scrimId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "userId" INTEGER,

    CONSTRAINT "ScrimRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScrimRequest" ADD CONSTRAINT "ScrimRequest_scrimId_fkey" FOREIGN KEY ("scrimId") REFERENCES "Scrim"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrimRequest" ADD CONSTRAINT "ScrimRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
