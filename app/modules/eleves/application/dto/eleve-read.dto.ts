/** Forme d'affichage d'un tuteur — pas de logique, juste des données (§5.2). */
export interface TuteurReadDto {
  id: string;
  nom: string;
  lienParente: string;
  telephone: string;
  profession?: string;
  adresse?: string;
  estContactPrincipal: boolean;
}

/** Forme d'affichage d'une fiche élève complète (dossier technique §5.1, GET /eleves/{id}). */
export interface EleveReadDto {
  id: string;
  etablissementId: string;
  matricule: string;
  nom: string;
  prenoms: string;
  nomComplet: string;
  sexe: "M" | "F";
  dateNaissance: string;
  lieuNaissance?: string;
  photoUrl?: string;
  etat: "ACTIF" | "ARCHIVE";
  tuteurs: TuteurReadDto[];
  contactPrincipal?: TuteurReadDto;
}

/**
 * Forme allégée pour les listes (GET /eleves) — dossier technique §5.1.
 * Volontairement sans les tuteurs : évite de charger une donnée
 * sensible/inutile pour un simple tableau de résultats.
 */
export interface EleveResumeReadDto {
  id: string;
  matricule: string;
  nomComplet: string;
  sexe: "M" | "F";
  etat: "ACTIF" | "ARCHIVE";
}