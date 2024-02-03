/*
  Warnings:

  - You are about to drop the column `game_duration` on the `match_history` table. All the data in the column will be lost.
  - You are about to drop the column `game_id` on the `match_history` table. All the data in the column will be lost.
  - You are about to drop the column `game_type` on the `match_history` table. All the data in the column will be lost.
  - You are about to drop the column `result` on the `match_history` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `match_history` table. All the data in the column will be lost.
  - Added the required column `ended_at` to the `match_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `looser_id` to the `match_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player1_score` to the `match_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player1_user_id` to the `match_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player1_username` to the `match_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2_score` to the `match_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2_user_id` to the `match_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player2_username` to the `match_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winner_id` to the `match_history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "match_history" DROP CONSTRAINT "match_history_game_id_fkey";

-- DropForeignKey
ALTER TABLE "match_history" DROP CONSTRAINT "match_history_user_id_fkey";

-- AlterTable
ALTER TABLE "match_history" DROP COLUMN "game_duration",
DROP COLUMN "game_id",
DROP COLUMN "game_type",
DROP COLUMN "result",
DROP COLUMN "user_id",
ADD COLUMN     "ended_at" TIMESTAMP(6) NOT NULL,
ADD COLUMN     "looser_id" INTEGER NOT NULL,
ADD COLUMN     "player1_score" INTEGER NOT NULL,
ADD COLUMN     "player1_user_id" INTEGER NOT NULL,
ADD COLUMN     "player1_username" VARCHAR(50) NOT NULL,
ADD COLUMN     "player2_score" INTEGER NOT NULL,
ADD COLUMN     "player2_user_id" INTEGER NOT NULL,
ADD COLUMN     "player2_username" VARCHAR(50) NOT NULL,
ADD COLUMN     "winner_id" INTEGER NOT NULL;
