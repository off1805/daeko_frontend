import { Inscription } from "../entities/inscription.entity";
import type { InscriptionActivePourNumerotation } from "../services/numero-ordre.service";

export interface PageResultat<T> {
  items: T[];
  total: number;
  page: number;
  taille: number;
}

/** GET /classes/{classeId}/inscriptions — dossier technique §5.3. */
export interface FiltresInscriptionsParClasse {
  classeId: string;
  etat?: "TOUTES" | string; // défaut : actives seulement (dossier technique §5.3)
  page?: number;
  taille?: number;
}


export interface InscriptionRepository {
  obtenirParId(id: string): Promise<Inscription | null>;

  listerParClasse(
    filtres: FiltresInscriptionsParClasse
  ): Promise<PageResultat<Inscription>>;

  /** ELV-003 : détecte une inscription ACTIVE déjà existante pour cet élève, cette année. */
  obtenirInscriptionActive(
    eleveId: string,
    anneeAcademiqueId: string
  ): Promise<Inscription | null>;

  /**
   * Entrée nécessaire à NumeroOrdreService.attribuer() : les
   * inscriptions actives de la classe cible, avec juste ce qu'il faut
   * pour trier alphabétiquement (nom/prénoms de l'élève, déjà résolus
   * par l'infrastructure via une jointure ou un appel au module Eleve).
   */
  listerActivesPourNumerotation(
    classeId: string
  ): Promise<InscriptionActivePourNumerotation[]>;

  listerMutations(inscriptionId: string): Promise<Inscription["mutations"]>;

  /** Persiste une inscription, nouvelle ou déjà existante. */
  sauvegarder(inscription: Inscription): Promise<void>;


  cloturerToutesActivesPourAnnee(anneeAcademiqueId: string): Promise<void>;
}