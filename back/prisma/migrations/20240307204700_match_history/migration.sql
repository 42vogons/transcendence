/*
  Warnings:

  - Added the required column `player1_avatar_url` to the `match_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2_avatar_url` to the `match_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "match_history" ADD COLUMN     "player1_avatar_url" VARCHAR(255) NOT NULL,
ADD COLUMN     "player2_avatar_url" VARCHAR(255) NOT NULL;
