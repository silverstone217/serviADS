-- AlterTable
ALTER TABLE "AudioSubscriber" ADD COLUMN     "ban_expires_at" TIMESTAMP(3),
ADD COLUMN     "ban_reason" TEXT,
ADD COLUMN     "is_banned" BOOLEAN NOT NULL DEFAULT false;
