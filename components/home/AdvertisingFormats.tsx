import {
  Headphones,
  Radio,
  Car,
  Store,
  //   Users,
  AudioWaveform,
} from "lucide-react";

const formats = [
  {
    icon: AudioWaveform,
    title: "Spot Classique",
    badge: "15 - 30s",
    description:
      "Un message audio percutant diffusé entre les playlists musicales ou les informations, offrant une mémorisation maximale.",
  },
  {
    icon: Radio,
    title: "Sponsoring Contextuel",
    badge: "Personnalisé",
    description:
      "Associez votre marque à des moments précis (météo, trafic) ou ciblez par zone géographique dynamique.",
  },
];

const stats = [
  {
    icon: Car,
    value: "2,500+",
    label: "Taxis Partenaires",
  },
  {
    icon: Headphones,
    value: "1.2M",
    label: "Écoutes Mensuelles",
  },
  {
    icon: Store,
    value: "450+",
    label: "Annonceurs Actifs",
  },
];

export function AdvertisingFormats() {
  return (
    <section>
      {/* Formats */}
      <div className="container mx-auto py-24  px-4 md:px-6 xl:px-8 dark:bg-gray-950 bg-gray-200 ">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Formats Publicitaires
          </h2>

          <p className="mt-3 text-muted-foreground">
            Des solutions audio adaptées à vos objectifs de notoriété et de
            conversion.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {formats.map((format) => {
            const Icon = format.icon;

            return (
              <div
                key={format.title}
                className="rounded-3xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{format.title}</h3>

                      <span className="rounded-full bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wide">
                        {format.badge}
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {format.description}
                    </p>

                    {format.title === "Spot Classique" && (
                      <div className="mt-5 flex items-end gap-1">
                        {[12, 22, 14, 28, 18, 10, 24, 14].map(
                          (height, index) => (
                            <div
                              key={index}
                              className="w-1 rounded-full bg-primary"
                              style={{ height }}
                            />
                          ),
                        )}
                      </div>
                    )}

                    {format.title === "Sponsoring Contextuel" && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-full bg-muted px-3 py-1 text-xs">
                          Géofencing
                        </span>

                        <span className="rounded-full bg-muted px-3 py-1 text-xs">
                          Horaire
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto py-16">
          <div className="grid gap-10 md:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="relative flex flex-col items-center text-center"
                >
                  {index !== stats.length - 1 && (
                    <div className="absolute top-1/2 right-0 hidden h-20 w-px -translate-y-1/2 bg-white/10 md:block" />
                  )}

                  <Icon className="mb-4 h-7 w-7" />

                  <div className="text-5xl font-bold tracking-tight">
                    {stat.value}
                  </div>

                  <div className="mt-2 text-sm opacity-80">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
