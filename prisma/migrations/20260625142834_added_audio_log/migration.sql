-- CreateTable
CREATE TABLE "logs" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "taxiUserId" TEXT NOT NULL,
    "avgSpeed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalDuration" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "logs_taxiUserId_campaignId_date_key" ON "logs"("taxiUserId", "campaignId", "date");

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "AudioCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_taxiUserId_fkey" FOREIGN KEY ("taxiUserId") REFERENCES "TaxiUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
