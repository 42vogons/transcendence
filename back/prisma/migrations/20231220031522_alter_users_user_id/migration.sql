/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "user_id" DROP DEFAULT;
DROP SEQUENCE "users_user_id_seq";

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");
