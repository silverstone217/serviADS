import Link from "next/link";
import { Radio, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

const links = [
  { name: "Accueil", href: "/" },
  { name: "Solutions", href: "/solutions" },
  { name: "FAQ", href: "/faq" },
];

const platformLinks = [
  { name: "Diffusion Audio", href: "/audio" },
  { name: "Administration", href: "/admins" },
];

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto py-20 px-4 md:px-6 xl:px-8 ">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Radio className="h-5 w-5" />
              </div>

              <div>
                <div className="text-lg font-bold">SERVI ADS</div>
                <div className="text-xs text-muted-foreground">
                  Publicité Audio Intelligente
                </div>
              </div>
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              La plateforme de diffusion publicitaire audio dédiée aux réseaux
              de mobilité urbaine. Créez, pilotez et analysez vos campagnes en
              temps réel.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider">
              Navigation
            </h3>

            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Plateforme */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider">
              Plateforme
            </h3>

            <ul className="space-y-3">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider">
              Contact
            </h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                <span>servigroup.social@gmail.com</span>
              </div>

              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                <span>+243 82 25 50 150</span>
              </div>

              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Kinshasa, RDC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="my-10 h-px bg-border" />

        {/* Bottom */}
        <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} SERVI ADS. Tous droits réservés.</p>

          <div className="flex flex-wrap gap-6">
            <Link
              href="/mentions-legales"
              className="transition-colors hover:text-foreground"
            >
              Mentions légales
            </Link>

            <Link
              href="/confidentialite"
              className="transition-colors hover:text-foreground"
            >
              Politique de confidentialité
            </Link>

            <Link
              href="/cgu"
              className="transition-colors hover:text-foreground"
            >
              Conditions d&apos;utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
