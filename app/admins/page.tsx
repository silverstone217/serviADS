import { getAllAudioCampaings } from "@/actions/campaign";
import MainComponent from "@/components/admins/campaigns/MainComponent";
import { inter } from "@/lib/fonts";
import React from "react";

export default async function page() {
  const audioCampaigns = await getAllAudioCampaings();

  return (
    <div className="pt-2 space-y-10">
      <div className="px-4 py-6 border-muted/20 flex flex-col bg-muted rounded-lg gap-1.5">
        <h2 className={`${inter.className} font-bold text-3xl`}>
          Les campagnes
        </h2>
        <p className="font-medium text-muted-foreground text-sm max-w-sm">
          Gestions de campagnes en cours et terminees. Creation et annulation
          des campagnes
        </p>
      </div>

      {/* MAIN COMPONENT */}
      <MainComponent audioCampaigns={audioCampaigns} />
    </div>
  );
}
