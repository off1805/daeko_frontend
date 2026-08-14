import { Etablissement } from "../entities/etablissement.entity";
import type { EtatCompteEtablissement } from "../shared/etat-compte-etablissement";

/** CU-01, RM-03 : les seuls champs nécessaires pour détecter un doublon, sans charger l'agrégat complet. */
export interface EtablissementResume {
  id: string;
  nomOfficiel: string;
  arrondissementId: string;
  ville: string;
}

/** 7.2, "Portefeuille des écoles" : filtres attendus sur l'écran liste. */
export interface FiltresEtablissements {
  etatCompte?: EtatCompteEtablissement;
  regionId?: string;
  statutJuridiqueCode?: string;
  recherche?: string;
  page?: number;
  taille?: number;
}

export interface PageResultat<T> {
  items: T[];
  total: number;
  page: number;
  taille: number;
}


export interface EtablissementRepository {
  /** 7.2, "Portefeuille des écoles". */
  lister(filtres: FiltresEtablissements): Promise<PageResultat<Etablissement>>;

  obtenirParId(id: string): Promise<Etablissement | null>;

  /** RM-03 : nécessaire pour vérifier les doublons avant création (CU-01), sans charger tous les agrégats complets. */
  listerResumesPourVerificationDoublon(): Promise<EtablissementResume[]>;

  /** Persiste un établissement, qu'il soit nouveau ou déjà existant (RM-12 : la traçabilité est déjà dans l'agrégat). */
  sauvegarder(etablissement: Etablissement): Promise<void>;
}