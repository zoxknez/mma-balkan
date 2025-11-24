-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MODERATOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "WeightClass" AS ENUM ('FLYWEIGHT', 'BANTAMWEIGHT', 'FEATHERWEIGHT', 'LIGHTWEIGHT', 'WELTERWEIGHT', 'MIDDLEWEIGHT', 'LIGHT_HEAVYWEIGHT', 'HEAVYWEIGHT', 'WOMENS_STRAWWEIGHT', 'WOMENS_FLYWEIGHT', 'WOMENS_BANTAMWEIGHT', 'WOMENS_FEATHERWEIGHT');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('SCHEDULED', 'UPCOMING', 'LIVE', 'COMPLETED', 'CANCELLED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "FightStatus" AS ENUM ('SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED', 'NO_CONTEST');

-- CreateEnum
CREATE TYPE "FinishMethod" AS ENUM ('KO_TKO', 'SUBMISSION', 'DECISION_UNANIMOUS', 'DECISION_SPLIT', 'DECISION_MAJORITY', 'DQ', 'NO_CONTEST', 'DRAW');

-- CreateEnum
CREATE TYPE "Stance" AS ENUM ('ORTHODOX', 'SOUTHPAW', 'SWITCH');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "lastPasswordChange" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "lastLogin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "isValid" BOOLEAN NOT NULL DEFAULT true,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "success" BOOLEAN NOT NULL,
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValue" JSONB,
    "newValue" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Club" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "address" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "logoUrl" TEXT,
    "description" TEXT,
    "members" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fighter" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "heightCm" INTEGER,
    "weightKg" INTEGER,
    "weightClass" "WeightClass" NOT NULL,
    "reachCm" INTEGER,
    "stance" "Stance",
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "koTkoWins" INTEGER NOT NULL DEFAULT 0,
    "submissionWins" INTEGER NOT NULL DEFAULT 0,
    "decisionWins" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "bio" TEXT,
    "instagramHandle" TEXT,
    "twitterHandle" TEXT,
    "deletedAt" TIMESTAMP(3),
    "lastFight" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fighter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "status" "EventStatus" NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "venue" TEXT,
    "mainEvent" TEXT,
    "posterUrl" TEXT,
    "streamUrl" TEXT,
    "ticketsAvailable" BOOLEAN NOT NULL DEFAULT false,
    "ticketUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "fightsCount" INTEGER NOT NULL DEFAULT 0,
    "attendees" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "imageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "trending" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "publishAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fight" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "orderNo" INTEGER NOT NULL DEFAULT 1,
    "section" TEXT NOT NULL DEFAULT 'PRELIMS',
    "weightClass" "WeightClass",
    "status" "FightStatus" NOT NULL DEFAULT 'SCHEDULED',
    "redFighterId" TEXT NOT NULL,
    "blueFighterId" TEXT NOT NULL,
    "winnerFighterId" TEXT,
    "method" "FinishMethod",
    "round" INTEGER,
    "timeMinutes" INTEGER,
    "timeSeconds" INTEGER,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Fight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fightId" TEXT NOT NULL,
    "predictedWinnerId" TEXT NOT NULL,
    "predictedMethod" TEXT,
    "predictedRound" INTEGER,
    "confidence" INTEGER NOT NULL DEFAULT 5,
    "points" INTEGER NOT NULL DEFAULT 0,
    "isCorrect" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WatchlistItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WatchlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowedFighter" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowedFighter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowedClub" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FollowedClub_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_emailVerificationToken_key" ON "User"("emailVerificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_passwordResetToken_key" ON "User"("passwordResetToken");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_emailVerified_idx" ON "User"("emailVerified");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "User_deletedAt_isActive_idx" ON "User"("deletedAt", "isActive");

-- CreateIndex
CREATE INDEX "User_deletedAt_email_idx" ON "User"("deletedAt", "email");

-- CreateIndex
CREATE INDEX "User_deletedAt_username_idx" ON "User"("deletedAt", "username");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_refreshToken_idx" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE INDEX "Session_isValid_idx" ON "Session"("isValid");

-- CreateIndex
CREATE INDEX "Session_userId_isValid_idx" ON "Session"("userId", "isValid");

-- CreateIndex
CREATE INDEX "LoginAttempt_email_createdAt_idx" ON "LoginAttempt"("email", "createdAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_ipAddress_createdAt_idx" ON "LoginAttempt"("ipAddress", "createdAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_userId_createdAt_idx" ON "LoginAttempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "LoginAttempt_success_idx" ON "LoginAttempt"("success");

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Club_name_idx" ON "Club"("name");

-- CreateIndex
CREATE INDEX "Club_city_idx" ON "Club"("city");

-- CreateIndex
CREATE INDEX "Club_country_idx" ON "Club"("country");

-- CreateIndex
CREATE INDEX "Club_createdAt_idx" ON "Club"("createdAt");

-- CreateIndex
CREATE INDEX "Club_deletedAt_idx" ON "Club"("deletedAt");

-- CreateIndex
CREATE INDEX "Club_country_city_idx" ON "Club"("country", "city");

-- CreateIndex
CREATE INDEX "Club_deletedAt_country_idx" ON "Club"("deletedAt", "country");

-- CreateIndex
CREATE INDEX "Fighter_name_idx" ON "Fighter"("name");

-- CreateIndex
CREATE INDEX "Fighter_country_idx" ON "Fighter"("country");

-- CreateIndex
CREATE INDEX "Fighter_countryCode_idx" ON "Fighter"("countryCode");

-- CreateIndex
CREATE INDEX "Fighter_weightClass_idx" ON "Fighter"("weightClass");

-- CreateIndex
CREATE INDEX "Fighter_isActive_idx" ON "Fighter"("isActive");

-- CreateIndex
CREATE INDEX "Fighter_wins_idx" ON "Fighter"("wins" DESC);

-- CreateIndex
CREATE INDEX "Fighter_losses_idx" ON "Fighter"("losses");

-- CreateIndex
CREATE INDEX "Fighter_createdAt_idx" ON "Fighter"("createdAt");

-- CreateIndex
CREATE INDEX "Fighter_updatedAt_idx" ON "Fighter"("updatedAt");

-- CreateIndex
CREATE INDEX "Fighter_deletedAt_idx" ON "Fighter"("deletedAt");

-- CreateIndex
CREATE INDEX "Fighter_lastFight_idx" ON "Fighter"("lastFight");

-- CreateIndex
CREATE INDEX "Fighter_country_weightClass_isActive_idx" ON "Fighter"("country", "weightClass", "isActive");

-- CreateIndex
CREATE INDEX "Fighter_weightClass_wins_isActive_idx" ON "Fighter"("weightClass", "wins" DESC, "isActive");

-- CreateIndex
CREATE INDEX "Fighter_isActive_updatedAt_idx" ON "Fighter"("isActive", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Fighter_isActive_lastFight_idx" ON "Fighter"("isActive", "lastFight" DESC);

-- CreateIndex
CREATE INDEX "Fighter_deletedAt_isActive_idx" ON "Fighter"("deletedAt", "isActive");

-- CreateIndex
CREATE INDEX "Event_name_idx" ON "Event"("name");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "Event"("status");

-- CreateIndex
CREATE INDEX "Event_startAt_idx" ON "Event"("startAt");

-- CreateIndex
CREATE INDEX "Event_city_idx" ON "Event"("city");

-- CreateIndex
CREATE INDEX "Event_country_idx" ON "Event"("country");

-- CreateIndex
CREATE INDEX "Event_createdAt_idx" ON "Event"("createdAt");

-- CreateIndex
CREATE INDEX "Event_deletedAt_idx" ON "Event"("deletedAt");

-- CreateIndex
CREATE INDEX "Event_status_startAt_idx" ON "Event"("status", "startAt");

-- CreateIndex
CREATE INDEX "Event_country_city_startAt_idx" ON "Event"("country", "city", "startAt");

-- CreateIndex
CREATE INDEX "Event_status_startAt_desc_idx" ON "Event"("status", "startAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");

-- CreateIndex
CREATE INDEX "News_slug_idx" ON "News"("slug");

-- CreateIndex
CREATE INDEX "News_category_idx" ON "News"("category");

-- CreateIndex
CREATE INDEX "News_featured_idx" ON "News"("featured");

-- CreateIndex
CREATE INDEX "News_trending_idx" ON "News"("trending");

-- CreateIndex
CREATE INDEX "News_publishAt_idx" ON "News"("publishAt" DESC);

-- CreateIndex
CREATE INDEX "News_views_idx" ON "News"("views" DESC);

-- CreateIndex
CREATE INDEX "News_likes_idx" ON "News"("likes" DESC);

-- CreateIndex
CREATE INDEX "News_authorName_idx" ON "News"("authorName");

-- CreateIndex
CREATE INDEX "News_createdAt_idx" ON "News"("createdAt");

-- CreateIndex
CREATE INDEX "News_deletedAt_idx" ON "News"("deletedAt");

-- CreateIndex
CREATE INDEX "News_category_publishAt_idx" ON "News"("category", "publishAt" DESC);

-- CreateIndex
CREATE INDEX "News_featured_publishAt_idx" ON "News"("featured", "publishAt" DESC);

-- CreateIndex
CREATE INDEX "News_trending_publishAt_idx" ON "News"("trending", "publishAt" DESC);

-- CreateIndex
CREATE INDEX "News_featured_trending_publishAt_idx" ON "News"("featured", "trending", "publishAt" DESC);

-- CreateIndex
CREATE INDEX "News_deletedAt_publishAt_idx" ON "News"("deletedAt", "publishAt" DESC);

-- CreateIndex
CREATE INDEX "Fight_eventId_idx" ON "Fight"("eventId");

-- CreateIndex
CREATE INDEX "Fight_status_idx" ON "Fight"("status");

-- CreateIndex
CREATE INDEX "Fight_redFighterId_idx" ON "Fight"("redFighterId");

-- CreateIndex
CREATE INDEX "Fight_blueFighterId_idx" ON "Fight"("blueFighterId");

-- CreateIndex
CREATE INDEX "Fight_orderNo_idx" ON "Fight"("orderNo");

-- CreateIndex
CREATE INDEX "Fight_section_idx" ON "Fight"("section");

-- CreateIndex
CREATE INDEX "Fight_createdAt_idx" ON "Fight"("createdAt");

-- CreateIndex
CREATE INDEX "Fight_deletedAt_idx" ON "Fight"("deletedAt");

-- CreateIndex
CREATE INDEX "Fight_eventId_orderNo_idx" ON "Fight"("eventId", "orderNo");

-- CreateIndex
CREATE INDEX "Fight_status_eventId_idx" ON "Fight"("status", "eventId");

-- CreateIndex
CREATE INDEX "Fight_status_deletedAt_idx" ON "Fight"("status", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Fight_eventId_orderNo_key" ON "Fight"("eventId", "orderNo");

-- CreateIndex
CREATE INDEX "Prediction_userId_idx" ON "Prediction"("userId");

-- CreateIndex
CREATE INDEX "Prediction_fightId_idx" ON "Prediction"("fightId");

-- CreateIndex
CREATE INDEX "Prediction_points_idx" ON "Prediction"("points" DESC);

-- CreateIndex
CREATE INDEX "Prediction_createdAt_idx" ON "Prediction"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Prediction_userId_fightId_key" ON "Prediction"("userId", "fightId");

-- CreateIndex
CREATE INDEX "WatchlistItem_userId_idx" ON "WatchlistItem"("userId");

-- CreateIndex
CREATE INDEX "WatchlistItem_type_idx" ON "WatchlistItem"("type");

-- CreateIndex
CREATE INDEX "WatchlistItem_itemId_idx" ON "WatchlistItem"("itemId");

-- CreateIndex
CREATE INDEX "WatchlistItem_createdAt_idx" ON "WatchlistItem"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WatchlistItem_userId_type_itemId_key" ON "WatchlistItem"("userId", "type", "itemId");

-- CreateIndex
CREATE INDEX "FollowedFighter_userId_idx" ON "FollowedFighter"("userId");

-- CreateIndex
CREATE INDEX "FollowedFighter_fighterId_idx" ON "FollowedFighter"("fighterId");

-- CreateIndex
CREATE INDEX "FollowedFighter_createdAt_idx" ON "FollowedFighter"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FollowedFighter_userId_fighterId_key" ON "FollowedFighter"("userId", "fighterId");

-- CreateIndex
CREATE INDEX "FollowedClub_userId_idx" ON "FollowedClub"("userId");

-- CreateIndex
CREATE INDEX "FollowedClub_clubId_idx" ON "FollowedClub"("clubId");

-- CreateIndex
CREATE INDEX "FollowedClub_createdAt_idx" ON "FollowedClub"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "FollowedClub_userId_clubId_key" ON "FollowedClub"("userId", "clubId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginAttempt" ADD CONSTRAINT "LoginAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_redFighterId_fkey" FOREIGN KEY ("redFighterId") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fight" ADD CONSTRAINT "Fight_blueFighterId_fkey" FOREIGN KEY ("blueFighterId") REFERENCES "Fighter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "Fight"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchlistItem" ADD CONSTRAINT "WatchlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedFighter" ADD CONSTRAINT "FollowedFighter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedFighter" ADD CONSTRAINT "FollowedFighter_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "Fighter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedClub" ADD CONSTRAINT "FollowedClub_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowedClub" ADD CONSTRAINT "FollowedClub_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
