import { AudioLines, ListMusic } from "lucide-react";

export const HOME_LINKS = [
  {
    name: "Accueil",
    href: "/",
    isProtected: false,
  },
  {
    name: "Solutions",
    href: "/solutions",
    isProtected: false,
  },
  {
    name: "Mon Espace",
    href: "/mon-espace",
    isProtected: true,
  },
  {
    name: "Administration",
    href: "/admin",
    isProtected: true,
  },
  {
    name: "FAQ",
    href: "/faq",
    isProtected: false,
  },
];

export const DASHBOARD_LINKS = [
  {
    name: "Mon Espace",
    href: "/mon-espace",
    isProtected: true,
    icon: AudioLines,
  },
  {
    name: "mes campagnes",
    href: "/mon-espace/mes-campagnes",
    isProtected: true,
    icon: ListMusic,
  },
];
