import { Eleve } from "../entities/eleve.entity";
import type { EtatEleve } from "../shared/etat-eleve";

/** GET /eleves — dossier technique §5.1. */
export interface FiltresEleves {
  etablissementId: string;
  recherche?: string; // nom, prénoms ou matricule — insensible aux accents (§8)
  classeId?: string;
  anneeAcademiqueId?: string;
  etatInscription?: string;
  etat?: EtatEleve | "TOUS";
  page?: number;
  taille?: number;
}

export interface PageResultat<T> {
  items: T[];
  total: number;
  page: number;
  taille: number;
}

/** Nécessaire pour la vérification ELV-001 sans charger tous les agrégats complets. */
export interface EleveResume {
  id: string;
  matricule: string;
  nomComplet: string;
  classeLibelle?: string;
}


export interface EleveRepository {
  lister(filtres: FiltresEleves): Promise<PageResultat<Eleve>>;

  obtenirParId(id: string, etablissementId: string): Promise<Eleve | null>;

  /** ELV-001 : vérifie l'unicité du matricule DANS l'établissement (pas globalement). */
  obtenirParMatricule(
    matricule: string,
    etablissementId: string
  ): Promise<EleveResume | null>;

  sauvegarder(eleve: Eleve): Promise<void>;


  supprimer(id: string): Promise<void>;
}