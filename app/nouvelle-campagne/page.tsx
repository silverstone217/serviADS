import MainComponent from "@/components/new-campaign/MainComponent";
import { inter } from "@/lib/fonts";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div>
      <header className="">
        <div className="flex items-center justify-between p-4 md:px-6 xl:px-8 border-b">
          <Link
            href={"/"}
            className="text-secondary hover:text-foreground ease-in-out duration-300 transition-all"
          >
            <Undo2 />
          </Link>
          <h2 className={`text-xl font-bold ${inter.className}`}>
            Nouvelle Campagne
          </h2>
          <div></div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-4 md:px-6 xl:px-8 py-8">
        {/* MAIN CONTENT */}
        <div className="flex flex-col gap-4">
          <h1 className={`text-3xl font-bold ${inter.className}`}>
            Créer une Publicite audio
          </h1>
          <p className="text-muted-foreground">
            Configurez votre campagne publicitaire pour le réseau de transport
            urbain. Suivez les étapes pour définir votre audience et votre
            budget.
          </p>

          {/* MAIN COMPONENT */}
          <MainComponent />
        </div>
      </main>
    </div>
  );
}

export default page;
