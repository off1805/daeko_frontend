import { Inscription } from "../entities/inscription.entity";
import type { InscriptionActivePourNumerotation } from "../services/numero-ordre.service";

export interface PageResultat<T> {
  items: T[];
  total: number;
  page: number;
  taille: number;
}

export interface FiltresInscriptionsParClasse {
  classeId: string;
  etat?: "TOUTES" | string;
  page?: number;
  taille?: number;
}

/**
 * Port du module Élèves — agrégat Inscription (dossier technique §5.3,
 * §4.1). Interface uniquement ; l'implémentation vit dans
 * l'infrastructure.
 */
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
   * NOUVEAU : contrairement à obtenirInscriptionActive() (qui ignore
   * les inscriptions déjà closes), celle-ci renvoie l'inscription de
   * l'élève pour cette année QUEL QUE SOIT SON ÉTAT — nécessaire pour
   * que l'écran détail sache afficher "Réactiver" sur une inscription
   * déjà terminée.
   */
  obtenirParEleveEtAnnee(
    eleveId: string,
    anneeAcademiqueId: string
  ): Promise<Inscription | null>;

  listerActivesPourNumerotation(
    classeId: string
  ): Promise<InscriptionActivePourNumerotation[]>;

  listerMutations(inscriptionId: string): Promise<Inscription["mutations"]>;

  sauvegarder(inscription: Inscription): Promise<void>;

  cloturerToutesActivesPourAnnee(anneeAcademiqueId: string): Promise<void>;
}