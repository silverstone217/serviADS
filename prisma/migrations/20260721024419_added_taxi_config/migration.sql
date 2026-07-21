-- CreateTable
CREATE TABLE "TaxiCampaignConfig" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "taxiUserId" TEXT NOT NULL,
    "downloadedSounds" INTEGER NOT NULL DEFAULT 0,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "paidAt" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxiCampaignConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TaxiCampaignConfig_campaignId_idx" ON "TaxiCampaignConfig"("campaignId");

-- CreateIndex
CREATE INDEX "TaxiCampaignConfig_taxiUserId_idx" ON "TaxiCampaignConfig"("taxiUserId");

-- CreateIndex
CREATE UNIQUE INDEX "TaxiCampaignConfig_campaignId_taxiUserId_key" ON "TaxiCampaignConfig"("campaignId", "taxiUserId");

-- AddForeignKey
ALTER TABLE "TaxiCampaignConfig" ADD CONSTRAINT "TaxiCampaignConfig_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "AudioCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxiCampaignConfig" ADD CONSTRAINT "TaxiCampaignConfig_taxiUserId_fkey" FOREIGN KEY ("taxiUserId") REFERENCES "TaxiUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
