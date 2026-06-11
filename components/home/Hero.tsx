// components/hero.tsx

import { ArrowRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { inter } from "@/lib/fonts";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full dark:bg-gray-950 bg-gray-200">
      <div
        className="container mx-auto md:py-20 lg:py-24 py-16
        grid items-center gap-16 lg:grid-cols-2 w-full grid-cols-1
        px-4 md:px-6 xl:px-8 
        "
      >
        {/* Content */}
        <div className="w-full">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-2 text-xs font-medium">
            <Radio className="h-3.5 w-3.5 text-primary" />
            PLATEFORME AUDIO PREMIUM
          </div>

          {/* TITLE */}
          <h1
            className={`text-5xl font-bold tracking-tight text-balance lg:text-7xl ${inter.className}`}
          >
            Faites entendre votre <span className="text-primary">marque </span>
            partout en ville
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
            Atteignez une audience captive grâce à la diffusion publicitaire
            audio intelligente dans les flottes de taxis partenaires. Ciblez,
            diffusez et mesurez avec précision.
          </p>

          {/* BUTTONS */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href={"/mon-espace"} className="w-full sm:w-fit">
              <Button size="lg" className="gap-2 w-full">
                Créer ma campagne
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href={"/solutions"} className="w-full sm:w-fit">
              <Button variant="secondary" size="lg" className="w-full">
                Découvrir les solutions
              </Button>
            </Link>
          </div>
        </div>

        {/* Visual */}

        <div className="relative w-full">
          <div className="relative w-full overflow-hidden rounded-4xl border bg-muted shadow-2xl h-64 md:h-96">
            <Image
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1170&auto=format&fit=crop"
              alt="Hero"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" />
          </div>

          {/* Floating card */}
          <div
            className="absolute bottom-6 left-6 right-6 z-10 rounded-2xl border border-white/20 
          bg-white/90 p-4 backdrop-blur-xl shadow-xl text-black"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                  <Radio className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    En cours de diffusion
                  </p>
                  <p className="font-semibold text-primary/60 text-sm md:text-base ">
                    Campagne Mobilité Urbaine
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="md:text-2xl text-xl font-bold text-primary">
                  24,5K
                </p>
                <p className="text-xs text-muted-foreground">
                  Auditeurs touchés
                </p>
              </div>
            </div>
          </div>

          {/* Decorative blur */}
          <div className="absolute -top-10 -z-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
