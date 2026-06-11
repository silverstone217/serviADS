import MainComponent from "@/components/new-campaign/MainComponent";
import { inter } from "@/lib/fonts";
import React from "react";

function page() {
  return (
    <div className="container mx-auto px-4 md:px-6 xl:px-8 py-8">
      {/* MAIN */}

      {/* MAIN CONTENT */}
      <main className="flex flex-col gap-4 mx-auto max-w-6xl px-4">
        <h1 className={`text-3xl font-bold ${inter.className}`}>
          Créer une Publicite audio
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Configurez votre campagne publicitaire pour le réseau de transport
          urbain. Suivez les étapes pour définir votre audience et votre budget.
        </p>

        {/* MAIN COMPONENT */}
        <MainComponent />
      </main>
    </div>
  );
}

export default page;
