import {
  AudioLines,
  ListMusic,
  ShieldAlert,
  House,
  RadioTower,
  Kanban,
  MessageCircleQuestionMark,
  Users,
} from "lucide-react";

export const HOME_LINKS = [
  {
    name: "Accueil",
    href: "/",
    isProtected: false,
    icon: House,
  },
  {
    name: "Solutions",
    href: "/solutions",
    isProtected: false,
    icon: RadioTower,
  },
  {
    name: "Audio",
    href: "/audio",
    isProtected: true,
    icon: Kanban,
  },
  {
    name: "Administration",
    href: "/admins",
    isProtected: true,
    icon: ShieldAlert,
  },
  {
    name: "FAQ",
    href: "/faq",
    isProtected: false,
    icon: MessageCircleQuestionMark,
  },
];

export const DASHBOARD_LINKS = [
  {
    name: "Audio diffusion",
    href: "/audio",
    isProtected: true,
    icon: AudioLines,
  },
  {
    name: "mes campagnes",
    href: "/audio/mes-campagnes",
    isProtected: true,
    icon: ListMusic,
  },
];

export const ADMINS_LINKS = [
  {
    name: "Campagnes",
    href: "/admins",
    isProtected: true,
    icon: Kanban,
  },
  {
    name: "Utilisateurs",
    href: "/admins/utilisateurs",
    isProtected: true,
    icon: Users,
  },
];
