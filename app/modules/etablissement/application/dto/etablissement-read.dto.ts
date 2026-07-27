import type { EtatCompte } from '~/modules/etablissement/domain/shared/etat-compte';
import type { StatutJuridique } from '~/modules/etablissement/domain/shared/statut-juridique';
import type { ModeEnTete } from '~/modules/etablissement/domain/value-objects/en-tete-ligne.vo';

/**
 * DTO représentant la localisation administrative d'un établissement pour l'IHM.
 */
export interface LocalisationDto {
  regionCode: string;
  regionLibelle?: string;
  departementCode: string;
  departementLibelle?: string;
  arrondissementCode: string;
  arrondissementLibelle?: string;
  ville: string;
}

/**
 * DTO représentant les coordonnées de contact.
 */
export interface ContactEtablissementDto {
  email?: string;
  telephone?: string;
  adressePostale?: string;
  siteWeb?: string;
}

/**
 * DTO représentant une ligne de l'en-tête officiel.
 */
export interface LigneEnTeteDto {
  ordre: number;
  texteFr: string;
  texteEn?: string;
}

/**
 * DTO représentant l'en-tête officiel complet.
 */
export interface EnTeteDto {
  id: string;
  mode: ModeEnTete;
  lignes: LigneEnTeteDto[];
  deviseSpecifique?: string;
}

/**
 * DTO représentant un signataire officiel.
 */
export interface SignataireDto {
  id: string;
  nom: string;
  prenom?: string;
  nomComplet: string;
  fonction: string;
  estPrincipal: boolean;
  signatureImageUrl?: string;
  estActif: boolean;
  dateFinFonction?: string; // Format ISO string pour l'UI
}

/**
 * DTO représentant l'état de complétude de la fiche établissement (RM-08, F-07)[cite: 1].
 */
export interface CompletudeStatusDto {
  pourcentage: number;
  elementsManquants: string[];
  estComplet: boolean;
}

/**
 * DTO représentant une entrée de l'historique d'audit (RM-12, F-12)[cite: 1].
 */
export interface AuditChangementDetailDto {
  champ: string;
  valeurAncienne?: string;
  valeurNouvelle?: string;
}

export interface AuditEtablissementDto {
  id: string;
  action: string;
  auteurNom: string;
  modifications: AuditChangementDetailDto[];
  date: string; // ISO string
}

/**
 * DTO principal consolidé pour l'affichage de la fiche complète de l'établissement dans le Dashboard React[cite: 1].
 */
export interface EtablissementReadDto {
  id: string;
  tenantId: string;
  nomOfficiel: string;
  sigle?: string;
  codeOfficiel?: string;
  agrement?: string;
  statutJuridique: StatutJuridique;
  statutJuridiqueLibelle: string;
  etat: EtatCompte;
  motifChangementEtat?: string;
  logoUrl?: string;
  devisePropre?: string;
  localisation: LocalisationDto;
  contacts: ContactEtablissementDto;
  enTete?: EnTeteDto;
  signataires: SignataireDto[];
  completude: CompletudeStatusDto;
  createdAt: string;
  updatedAt: string;
}