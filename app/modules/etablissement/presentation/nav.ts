import {
  BookUserIcon,
  BuildingIcon,
  FileTextIcon,
  ShieldIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react"

export type EtablissementSectionKey =
  | "portefeuille"
  | "fiche"
  | "en-tete"
  | "signataires"
  | "audit"

export interface EtablissementNavItem {
  key: EtablissementSectionKey
  title: string
  description: string
  icon: LucideIcon
}

export interface EtablissementNavSection {
  title: string
  items: EtablissementNavItem[]
}

export const etablissementNavSections: EtablissementNavSection[] = [
  {
    title: "Établissements",
    items: [
      {
        key: "portefeuille",
        title: "Portefeuille Établissements",
        description: "Liste, recherche et création des établissements",
        icon: BuildingIcon,
      },
    ],
  },
  {
    title: "Fiche établissement",
    items: [
      {
        key: "fiche",
        title: "Fiche & Localisation",
        description: "Identité administrative et ancrage territorial",
        icon: BookUserIcon,
      },
      {
        key: "en-tete",
        title: "Configuration En-Tête",
        description: "En-tête officiel des documents (mode simple/bilingue)",
        icon: FileTextIcon,
      },
      {
        key: "signataires",
        title: "Signataires Officiels",
        description: "Personnes habilitées à signer les documents",
        icon: UsersIcon,
      },
    ],
  },
  {
    title: "Traçabilité",
    items: [
      {
        key: "audit",
        title: "Journal Audit & Traçabilité",
        description: "Historique des actions sur les établissements",
        icon: ShieldIcon,
      },
    ],
  },
]

export const etablissementNavItemsFlat: EtablissementNavItem[] =
  etablissementNavSections.flatMap((section) => section.items)