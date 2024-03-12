-- CreateTable
CREATE TABLE "achievements" (
    "achievement_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "achievements_pkey" PRIMARY KEY ("achievement_id")
);

-- CreateTable
CREATE TABLE "admin_actions" (
    "action_id" SERIAL NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "target_user_id" INTEGER NOT NULL,
    "action_type" VARCHAR(50) NOT NULL,
    "executed_by" INTEGER NOT NULL,
    "start_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(6),

    CONSTRAINT "admin_actions_pkey" PRIMARY KEY ("action_id")
);

-- CreateTable
CREATE TABLE "channel_members" (
    "channel_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'member',

    CONSTRAINT "channel_members_pkey" PRIMARY KEY ("channel_id","user_id")
);

-- CreateTable
CREATE TABLE "channels" (
    "channel_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(20) DEFAULT 'public',
    "password" VARCHAR(255),
    "owner_id" INTEGER,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("channel_id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "message_id" SERIAL NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "channel_id" INTEGER,
    "content" TEXT NOT NULL,
    "timestamp" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "friends" (
    "user_id" INTEGER NOT NULL,
    "friend_id" INTEGER NOT NULL,

    CONSTRAINT "friends_pkey" PRIMARY KEY ("user_id","friend_id")
);

-- CreateTable
CREATE TABLE "game_queue" (
    "queue_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "entered_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "priority" INTEGER DEFAULT 0,

    CONSTRAINT "game_queue_pkey" PRIMARY KEY ("queue_id")
);

-- CreateTable
CREATE TABLE "games" (
    "game_id" SERIAL NOT NULL,
    "player1_id" INTEGER NOT NULL,
    "player2_id" INTEGER NOT NULL,
    "player1_score" INTEGER DEFAULT 0,
    "player2_score" INTEGER DEFAULT 0,
    "start_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "end_time" TIMESTAMP(6),

    CONSTRAINT "games_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "match_history" (
    "history_id" SERIAL NOT NULL,
    "player1_user_id" INTEGER NOT NULL,
    "player1_username" VARCHAR(50) NOT NULL,
    "player1_score" INTEGER NOT NULL,
    "player1_avatar_url" VARCHAR(255) NOT NULL,
    "player2_user_id" INTEGER NOT NULL,
    "player2_username" VARCHAR(50) NOT NULL,
    "player2_score" INTEGER NOT NULL,
    "player2_avatar_url" VARCHAR(255) NOT NULL,
    "winner_id" INTEGER NOT NULL,
    "looser_id" INTEGER NOT NULL,
    "ended_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "match_history_pkey" PRIMARY KEY ("history_id")
);

-- CreateTable
CREATE TABLE "user_achievements" (
    "user_id" INTEGER NOT NULL,
    "achievement_id" INTEGER NOT NULL,
    "date_achieved" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_achievements_pkey" PRIMARY KEY ("user_id","achievement_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100),
    "token" VARCHAR(255),
    "token_secret" VARCHAR(255),
    "user_id_42" VARCHAR(255),
    "avatar_url" VARCHAR(255),
    "status" VARCHAR(20) DEFAULT 'offline',
    "two_factor_enabled" BOOLEAN DEFAULT false,
    "total_games" INTEGER DEFAULT 0,
    "total_wins" INTEGER DEFAULT 0,
    "total_losses" INTEGER DEFAULT 0,
    "ladder_level" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "blocklist" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "blockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "channelId" INTEGER NOT NULL,

    CONSTRAINT "blocklist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "blocklist_userId_memberId_key" ON "blocklist"("userId", "memberId");

-- AddForeignKey
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("channel_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_executed_by_fkey" FOREIGN KEY ("executed_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "admin_actions" ADD CONSTRAINT "admin_actions_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("channel_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channel_members" ADD CONSTRAINT "channel_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channels"("channel_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "game_queue" ADD CONSTRAINT "game_queue_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player1_id_fkey" FOREIGN KEY ("player1_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_player2_id_fkey" FOREIGN KEY ("player2_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "achievements"("achievement_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blocklist" ADD CONSTRAINT "blocklist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocklist" ADD CONSTRAINT "blocklist_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO users (username) VALUES (' ');
