export interface MutationReadDto {
  id: string;
  classeOrigineId: string;
  classeArriveeId: string;
  numeroOrdreOrigine: number;
  numeroOrdreArrivee: number;
  dateMutation: string;
  motif: string;
  acteurId: string;
}

export interface InscriptionReadDto {
  id: string;
  etablissementId: string;
  eleveId: string;
  classeId: string;
  anneeAcademiqueId: string;
  numeroOrdre: number;
  etat: "ACTIVE" | "ABANDONNEE" | "EXCLUE" | "ACHEVEE";
  dateInscription: string;
  dateCloture?: string;
  motifCloture?: string;
  mutations: MutationReadDto[];
}

/** GET /classes/{id}/inscriptions — forme allégée, sans l'historique des mutations (§5.3). */
export interface InscriptionResumeReadDto {
  id: string;
  eleveId: string;
  numeroOrdre: number;
  etat: "ACTIVE" | "ABANDONNEE" | "EXCLUE" | "ACHEVEE";
}