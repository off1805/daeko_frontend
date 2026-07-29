import type { LienParente } from "../../domain/shared/lien-parente";

/** CU-01 : ce que le formulaire de création envoie (dossier technique §5.1, POST /eleves). */
export interface CreerTuteurInputDto {
  nom: string;
  lienParente: LienParente;
  telephone: string;
  profession?: string;
  adresse?: string;
  estContactPrincipal: boolean;
}

export interface CreerEleveInputDto {
  etablissementId: string;
  matricule: string;
  nom: string;
  prenoms: string;
  sexe: "M" | "F";
  dateNaissance: string;
  lieuNaissance?: string;
  photoUrl?: string;
  /** RM-E-04 : au moins un tuteur, un seul avec estContactPrincipal = true. */
  tuteurs: CreerTuteurInputDto[];
}

/** PATCH /eleves/{id} : tous les champs optionnels, seuls ceux fournis sont modifiés. */
export interface ModifierEleveInputDto {
  nom?: string;
  prenoms?: string;
  sexe?: "M" | "F";
  dateNaissance?: string;
  lieuNaissance?: string;
  photoUrl?: string;
  matricule?: string;
}

export interface ModifierTuteurInputDto {
  nom?: string;
  telephone?: string;
  profession?: string;
  adresse?: string;
}