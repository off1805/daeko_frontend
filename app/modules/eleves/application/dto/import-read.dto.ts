export interface ImportLotReadDto {
  id: string;
  etablissementId: string;
  fichierNom: string;
  statut: string;
  correspondanceColonnes: Record<string, string>;
  classeCibleId?: string;
  nbLignes: number;
  nbCreees: number;
  nbRejetees: number;
  progression: number; // 0 à 1, pour une barre de progression (§5.4)
}

export interface ImportLigneReadDto {
  id: string;
  numeroLigne: number;
  donneesBrutes: Record<string, string>;
  statut: string;
  codeRejet?: string;
  messageRejet?: string;
  eleveId?: string;
}

/** GET /imports/{id}/previsualisation : premières lignes interprétées (dossier technique §5.4). */
export interface PrevisualisationLigneDto {
  numeroLigne: number;
  donneesInterpretees: Record<string, string>;
  problemesDetectes: string[];
}