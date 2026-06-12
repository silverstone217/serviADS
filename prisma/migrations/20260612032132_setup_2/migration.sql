-- CreateEnum
CREATE TYPE "StatusAudioCampaign" AS ENUM ('en_cours', 'terminee', 'en_pause');

-- CreateTable
CREATE TABLE "AudioCampaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "StatusAudioCampaign" NOT NULL DEFAULT 'en_cours',
    "duration" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "costPerAudio" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AudioCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioSubscriber" (
    "id" TEXT NOT NULL,
    "audioCampaignId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "audioFile" TEXT,
    "audioDuration" DOUBLE PRECISION NOT NULL,
    "zone" TEXT NOT NULL DEFAULT 'kinshasa',
    "taxiNumber" INTEGER NOT NULL DEFAULT 1,
    "companyName" TEXT,
    "clientPhone" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AudioSubscriber_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AudioSubscriber" ADD CONSTRAINT "AudioSubscriber_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioSubscriber" ADD CONSTRAINT "AudioSubscriber_audioCampaignId_fkey" FOREIGN KEY ("audioCampaignId") REFERENCES "AudioCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
