"use client";

import React, { useState, useMemo } from "react";
import { UserRole } from "@/lib/generated/prisma/enums";
import {
  Car,
  Search,
  Users,
  ShieldAlert,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  UserX,
  XCircle,
  Calendar,
  Eye,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export interface UserInterface {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  phone: string;
  isBanned: boolean;
  createdAt: Date;
  role: UserRole;
}

export type TaxiInterface = Omit<UserInterface, "role">;

interface Props {
  users: UserInterface[];
  taxis: TaxiInterface[];
}

const roleItems = [
  { label: "Tous les rôles", value: "TOUT" },
  { label: "Admin", value: "ADMIN" },
  { label: "Client", value: "USER" },
];

const ITEMS_PER_PAGE = 6;

export default function MainComponent({ taxis = [], users = [] }: Props) {
  const [tabView, setTabView] = useState<"taxis" | "users">("taxis");
  const [searchText, setSearchText] = useState("");
  const [role, setRole] = useState<UserRole | "TOUT">("TOUT");
  const [bannedOnly, setBannedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleTabChange = (tab: "taxis" | "users") => {
    setTabView(tab);
    setCurrentPage(1);
  };

  // Filtrage combiné sécurisé pour les types
  const filteredData = useMemo(() => {
    const rawData = tabView === "taxis" ? taxis : users;

    return rawData.filter((item) => {
      // 1. Filtre Recherche Texte
      const query = searchText.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query);

      // 2. Filtre Rôle (Vérification si la propriété role existe)
      const hasRole = "role" in item;
      const matchesRole =
        role === "TOUT" || (hasRole && (item as UserInterface).role === role);

      // 3. Filtre Banni
      const matchesBanned = !bannedOnly || item.isBanned;

      return matchesSearch && matchesRole && matchesBanned;
    });
  }, [tabView, taxis, users, searchText, role, bannedOnly]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  return (
    <div className="flex flex-col gap-y-8 w-full max-w-7xl mx-auto p-4 md:p-6">
      {/* HEADER & TABS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {tabView === "taxis"
              ? "Gestion des Taxis"
              : "Gestion des Utilisateurs"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez et filtrez les comptes enregistrés dans la plateforme.
          </p>
        </div>

        <div className="bg-card border border-border p-1 rounded-xl flex gap-1 w-full sm:w-auto">
          <Button
            type="button"
            variant={tabView === "taxis" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTabChange("taxis")}
            className="flex-1 sm:flex-initial items-center gap-2 rounded-lg font-medium"
          >
            <Car size={18} />
            <span>Taxis ({taxis.length})</span>
          </Button>
          <Button
            type="button"
            variant={tabView === "users" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTabChange("users")}
            className="flex-1 sm:flex-initial items-center gap-2 rounded-lg font-medium"
          >
            <Users size={18} />
            <span>Utilisateurs ({users.length})</span>
          </Button>
        </div>
      </div>

      {/* FILTRES */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-center justify-between bg-card/50 p-4 rounded-xl border border-border">
        <div className="flex flex-1 flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* SEARCH INPUT */}
          <div className="relative flex-1 min-w-55">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              placeholder="Nom, email, téléphone..."
              className="pl-9 pr-8 bg-background border-input"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
            />
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <XCircle size={16} />
              </button>
            )}
          </div>

          {/* SELECT ROLE (Visible uniquement si l'onglet Utilisateurs est actif) */}
          {tabView === "users" && (
            <Select
              onValueChange={(val) => {
                setRole(val as UserRole | "TOUT");
                setCurrentPage(1);
              }}
              value={role}
            >
              <SelectTrigger className="w-full sm:w-45 bg-background">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {roleItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* CHECKBOX BANNI */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-input shrink-0">
          <Checkbox
            id="banned-users"
            checked={bannedOnly}
            onCheckedChange={(value) => {
              setBannedOnly(!!value);
              setCurrentPage(1);
            }}
          />
          <Label
            htmlFor="banned-users"
            className={`text-sm font-medium cursor-pointer select-none transition-colors ${
              bannedOnly
                ? "text-destructive font-semibold"
                : "text-muted-foreground"
            }`}
          >
            Uniquement les bannis
          </Label>
        </div>
      </div>

      {/* LISTE DES CARTES */}
      {paginatedData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedData.map((item) => {
            const initials = item.name
              ? item.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase()
              : "U";

            // Type Guard pour déterminer si c'est un User avec un Role
            const userRole =
              "role" in item ? (item as UserInterface).role : null;

            // URL de redirection dynamique
            const detailsHref =
              tabView === "taxis"
                ? `/admins/utilisateurs/taxis/${item.id}`
                : `/admins/utilisateurs/clients/${item.id}`;

            return (
              <Card
                key={item.id}
                className={`overflow-hidden border transition-all hover:border-primary/50 relative ${
                  item.isBanned
                    ? "border-destructive/40 bg-destructive/5"
                    : "bg-card"
                }`}
              >
                <CardContent className="p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border border-border">
                        <AvatarImage
                          src={item.image || undefined}
                          alt={item.name || "Avatar"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-base leading-tight text-foreground line-clamp-1">
                          {item.name || "Utilisateur sans nom"}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          ID: {item.id.slice(-6)}
                        </p>
                      </div>
                    </div>

                    {item.isBanned ? (
                      <Badge
                        variant="destructive"
                        className="flex items-center gap-1 shrink-0"
                      >
                        <UserX size={12} /> Banni
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-accent text-accent-foreground shrink-0"
                      >
                        <UserCheck size={12} className="mr-1" /> Actif
                      </Badge>
                    )}
                  </div>

                  <div className="h-px bg-border/60 w-full" />

                  <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 truncate">
                      <Mail size={15} className="shrink-0 text-primary" />
                      <span className="truncate">
                        {item.email || "Non renseigné"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={15} className="shrink-0 text-primary" />
                      <span>{item.phone || "Non renseigné"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-80 pt-1">
                      <Calendar size={14} className="shrink-0" />
                      <span>
                        Inscrit le{" "}
                        {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  </div>

                  {/* FOOTER : Rôle & Bouton de redirection */}
                  <div className="pt-3 border-t border-border/50 flex justify-between items-center mt-auto">
                    {userRole ? (
                      <Badge
                        variant="outline"
                        className="uppercase text-[10px] tracking-wider font-bold"
                      >
                        {userRole}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="uppercase text-[10px] tracking-wider font-bold border-primary/30 text-primary"
                      >
                        TAXI
                      </Badge>
                    )}

                    {/* LIEN DE REDIRECTION */}
                    <Button
                      asChild
                      size="sm"
                      variant="ghost"
                      className="gap-1.5 text-xs text-primary hover:text-primary hover:bg-primary/10"
                    >
                      <Link href={detailsHref}>
                        <Eye size={14} />
                        <span>Détails</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* ÉTAT VIDE */
        <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-xl bg-card/30 gap-3">
          <div className="p-3 bg-muted rounded-full text-muted-foreground">
            <ShieldAlert size={32} />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Aucun résultat trouvé
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Aucun {tabView === "taxis" ? "taxi" : "utilisateur"} ne correspond à
            vos critères de recherche actuels.
          </p>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            Page{" "}
            <span className="font-medium text-foreground">{currentPage}</span>{" "}
            sur{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Suivant <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
