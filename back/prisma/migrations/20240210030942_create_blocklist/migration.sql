-- CreateTable
CREATE TABLE "blocklist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "blockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blocklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blocklist_userId_memberId_key" ON "blocklist"("userId", "memberId");

-- AddForeignKey
ALTER TABLE "blocklist" ADD CONSTRAINT "blocklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocklist" ADD CONSTRAINT "blocklist_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
