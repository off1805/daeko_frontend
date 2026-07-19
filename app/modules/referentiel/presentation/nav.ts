import {
  BookCheckIcon,
  BookOpenTextIcon,
  LandmarkIcon,
  LayersIcon,
  ListTreeIcon,
  RouteIcon,
  WorkflowIcon,
  type LucideIcon,
} from "lucide-react";

/**
 * Structure de navigation du référentiel, doc section 1 : système
 * éducatif (racines) -> parcours scolaire (cycle/niveau) -> orientation
 * (filière/série) -> programmes d'étude (matières/affectations). Partagée
 * entre AppSidebar (rendu) et la route dashboard (résolution du contenu
 * actif) pour n'avoir qu'une seule source de vérité sur les clés.
 */

export type ReferentielSectionKey =
  | "systeme-enseignement"
  | "cycles"
  | "niveaux"
  | "filieres"
  | "series"
  | "matieres"
  | "affectations-matieres";

export interface ReferentielNavItem {
  key: ReferentielSectionKey;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface ReferentielNavSection {
  title: string;
  items: ReferentielNavItem[];
}

export const referentielNavSections: ReferentielNavSection[] = [
  {
    title: "Système",
    items: [
      {
        key: "systeme-enseignement",
        title: "Système d'enseignement",
        description: "Sous-systèmes, types et ordres d'enseignement",
        icon: LandmarkIcon,
      },
    ],
  },
  {
    title: "Parcours scolaire",
    items: [
      {
        key: "cycles",
        title: "Cycles",
        description: "Cycles rattachés à un ordre d'enseignement",
        icon: LayersIcon,
      },
      {
        key: "niveaux",
        title: "Niveaux",
        description: "Niveaux rattachés à un cycle",
        icon: ListTreeIcon,
      },
    ],
  },
  {
    title: "Orientation",
    items: [
      {
        key: "filieres",
        title: "Filières",
        description: "Filières par ordre et type d'enseignement",
        icon: RouteIcon,
      },
      {
        key: "series",
        title: "Séries",
        description: "Séries rattachées à une filière",
        icon: WorkflowIcon,
      },
    ],
  },
  {
    title: "Programmes d'étude",
    items: [
      {
        key: "matieres",
        title: "Matières",
        description: "Catalogue officiel des matières",
        icon: BookOpenTextIcon,
      },
      {
        key: "affectations-matieres",
        title: "Affectations matières",
        description: "Matières affectées aux niveaux et séries",
        icon: BookCheckIcon,
      },
    ],
  },
];

export const referentielNavItemsFlat: ReferentielNavItem[] =
  referentielNavSections.flatMap((section) => section.items);
