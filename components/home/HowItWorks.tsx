import { SlidersHorizontal, FileText, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: SlidersHorizontal,
    title: "1. Configurez",
    description:
      "Définissez votre audience cible, vos zones géographiques et vos créneaux horaires idéaux.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: FileText,
    title: "2. Importez",
    description:
      "Téléchargez vos spots audio ou créez-les directement avec nos outils intégrés.",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: BarChart3,
    title: "3. Mesurez",
    description:
      "Suivez les performances de votre campagne en temps réel grâce à notre tableau de bord.",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24">
      <div className="container mx-auto  px-4 md:px-6 xl:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Comment ça marche ?
          </h2>

          <p className="mt-4 text-muted-foreground">
            Lancez votre campagne audio en trois étapes simples. Notre
            plateforme gère la distribution complexe pour vous.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="group relative rounded-3xl border bg-card p-8 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Ligne de connexion desktop */}
                <div className="absolute top-1/2 left-full hidden h-px w-6 -translate-y-1/2 bg-border xl:block group-last:hidden" />

                <div
                  className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${step.iconBg}`}
                >
                  <Icon className={`h-7 w-7 ${step.iconColor}`} />
                </div>

                <h3 className="mt-6 text-xl font-semibold">{step.title}</h3>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
