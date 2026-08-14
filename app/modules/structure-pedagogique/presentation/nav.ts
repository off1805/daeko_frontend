/**
 * Navigation globale du module (vision UX) : deux entrées à poids inégal
 * assumé — "Ma structure" est l'espace de travail vivant, "Historique" un
 * lien discret, jamais au même niveau visuel. `weight` pilote le rendu
 * dans AppSidebar (taille, présence d'icône, groupe de section ou non).
 */

export type StructurePedagogiqueScreenKey = "ma-structure" | "historique";

export interface StructurePedagogiqueNavItem {
  key: StructurePedagogiqueScreenKey;
  title: string;
  weight: "primary" | "secondary";
}

export const structurePedagogiqueNavItems: StructurePedagogiqueNavItem[] = [
  { key: "ma-structure", title: "Ma structure", weight: "primary" },
  { key: "historique", title: "Historique", weight: "secondary" },
];
