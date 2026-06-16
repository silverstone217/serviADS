import { getCurrentAudioCampaigns } from "@/actions/campaign";
import MainComponent from "@/components/new-campaign/MainComponent";
import { inter } from "@/lib/fonts";
import React from "react";

async function page() {
  const audioCampaigns = await getCurrentAudioCampaigns();

  return (
    <div className="container mx-auto px-4 md:px-6 xl:px-8 pb-8 pt-4">
      {/* MAIN */}

      {/* MAIN CONTENT */}
      <main className="flex flex-col gap-4 mx-auto max-w-6xl px-4">
        <h1
          className={`text-3xl font-bold ${inter.className} max-w-2xl w-full mx-auto
        px-4
          `}
        >
          Créer une Publicite audio
        </h1>

        {/* <p className="text-muted-foreground max-w-2xl">
          Configurez votre campagne publicitaire pour le réseau de transport
          urbain. Suivez les étapes pour définir votre audience et votre budget.
        </p> */}

        {/* MAIN COMPONENT */}
        {audioCampaigns && audioCampaigns.length > 0 ? (
          <MainComponent audioCampaigns={audioCampaigns} />
        ) : (
          <div
            className="px-4 py-6 max-w-2xl w-full mx-auto text-muted-foreground bg-muted
          rounded-lg
          "
          >
            <p>
              Pas de campagne disponible pour l&apos;instant, veuillez reessayer
              plus tard
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default page;
