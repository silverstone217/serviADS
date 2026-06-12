import { getAllAudiSubscribers } from "@/actions/audioSubscrib";
import { getUser } from "@/actions/user";
import AuthComponent from "@/components/AuthComponent";
import MainAudioSubscribers from "@/components/new-campaign/MainAudioSubscribers";
import { inter } from "@/lib/fonts";
import React from "react";

async function page() {
  const user = await getUser();

  if (!user) {
    return <AuthComponent />;
  }

  const audioSubscriptions = await getAllAudiSubscribers();

  return (
    <div className="min-h-screen bg-background text-foreground py-10 px-4 md:px-8">
      <div className="mx-auto container max-w-6xl space-y-10">
        {/* HEADER - Épuré et Professionnel */}
        <div className="flex flex-col gap-1 border-b border-border pb-6">
          <h1
            className={`${inter.className} font-bold text-3xl tracking-tight text-zinc-950 dark:text-zinc-50`}
          >
            Souscriptions Audio
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl">
            Pilotez les souscriptions, suivez le ciblage géographique des taxis
            et analysez le volume de diffusion en temps réel.
          </p>
        </div>

        {/* MAIN COMPONENT */}
        <MainAudioSubscribers audioSubscribers={audioSubscriptions} />
      </div>
    </div>
  );
}

export default page;
