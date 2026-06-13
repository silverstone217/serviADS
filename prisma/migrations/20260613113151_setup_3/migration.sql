/*
  Warnings:

  - You are about to drop the column `status` on the `AudioCampaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AudioCampaign" DROP COLUMN "status",
ADD COLUMN     "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
