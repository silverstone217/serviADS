import { getCurrentAudioCampaign } from "@/actions/campaign";
import MainComponent from "@/components/new-campaign/MainComponent";
import { inter } from "@/lib/fonts";
import React from "react";

async function page() {
  const audioCampaign = await getCurrentAudioCampaign();

  return (
    <div className="container mx-auto px-4 md:px-6 xl:px-8 pb-8 pt-4">
      {/* MAIN */}

      {/* MAIN CONTENT */}
      <main className="flex flex-col gap-4 mx-auto max-w-6xl px-4">
        <h1 className={`text-3xl font-bold ${inter.className} `}>
          Créer une Publicite audio
        </h1>
        {audioCampaign && (
          <span
            className={`line-clamp-1 capitalize text-xl font-bold ${inter.className} text-muted-foreground`}
          >
            {audioCampaign.name}
          </span>
        )}
        {/* <p className="text-muted-foreground max-w-2xl">
          Configurez votre campagne publicitaire pour le réseau de transport
          urbain. Suivez les étapes pour définir votre audience et votre budget.
        </p> */}

        {/* MAIN COMPONENT */}
        {audioCampaign ? (
          <MainComponent audioCampaign={audioCampaign} />
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
