/*
  Warnings:

  - A unique constraint covering the columns `[linkedinId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "linkedinData" JSONB,
ADD COLUMN     "linkedinId" TEXT,
ADD COLUMN     "linkedinSyncedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "VideoInterview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "questions" JSONB[],
    "responses" JSONB[],
    "overallScore" DOUBLE PRECISION,
    "confidenceScore" DOUBLE PRECISION,
    "clarityScore" DOUBLE PRECISION,
    "contentScore" DOUBLE PRECISION,
    "strengths" TEXT[],
    "improvements" TEXT[],
    "feedback" TEXT,
    "transcript" TEXT,
    "duration" INTEGER,
    "completedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoInterview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoInterview_sessionId_key" ON "VideoInterview"("sessionId");

-- CreateIndex
CREATE INDEX "VideoInterview_userId_idx" ON "VideoInterview"("userId");

-- CreateIndex
CREATE INDEX "VideoInterview_sessionId_idx" ON "VideoInterview"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "User_linkedinId_key" ON "User"("linkedinId");

-- AddForeignKey
ALTER TABLE "VideoInterview" ADD CONSTRAINT "VideoInterview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
