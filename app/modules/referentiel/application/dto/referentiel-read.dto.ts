import type { EtatReferentiel } from "~/modules/referentiel/domain/shared/etat-referentiel";
import type {
  DomaineMatiere,
  TypeMatiere,
} from "~/modules/referentiel/domain/entities/catalogue-matieres.entity";
import type { OperationAudit } from "~/modules/referentiel/domain/entities/audit-entry.entity";

/**
 * DTOs de lecture exposés à la présentation : forme JS idiomatique
 * (camelCase, libelle/libelleEn à plat). La conversion depuis/vers le
 * wire format snake_case de l'API réelle (doc section 5.3) sera de la
 * responsabilité du futur Http*Repository, pas de cette couche.
 */

export interface ReferentielLifecycleDto {
  id: string;
  etat: EtatReferentiel;
  dateEntreeVigueur: string;
  dateDepreciation: string | null;
  motifDepreciation: string | null;
  dateCreation: string;
  dateModification: string;
  creePar: string;
  modifiePar: string;
}

export interface SousSystemeDto extends ReferentielLifecycleDto {
  code: string;
  libelle: string;
  libelleCourt?: string;
  description?: string;
  languePrincipale: string;
}

export interface OrdreEnseignementDto extends ReferentielLifecycleDto {
  code: string;
  libelle: string;
  tutelleMinisterielle?: string;
  tutelleMinisterielleEn?: string;
  rang: number;
  description?: string;
}

export interface TypeEnseignementDto extends ReferentielLifecycleDto {
  code: string;
  libelle: string;
  description?: string;
}

export interface CycleDto extends ReferentielLifecycleDto {
  sousSystemeId: string;
  ordreEnseignementId: string;
  code: string;
  libelle: string;
  libelleEn?: string;
  rang: number;
  dureeTheoriqueAnnees: number;
  description?: string;
}

export interface NiveauDto extends ReferentielLifecycleDto {
  cycleId: string;
  code: string;
  libelle: string;
  libelleCourt?: string;
  libelleEn?: string;
  rangDansCycle: number;
  ageTheoriqueDebut?: number;
  description?: string;
}

export interface FiliereDto extends ReferentielLifecycleDto {
  ordreEnseignementId: string;
  typeEnseignementId: string;
  code: string;
  libelle: string;
  libelleEn?: string;
  description?: string;
}

export interface SerieDto extends ReferentielLifecycleDto {
  filiereId: string;
  niveauApparitionId: string;
  code: string;
  libelle: string;
  libelleCourt?: string;
  libelleEn?: string;
  description?: string;
}

export interface MatiereReferentielDto extends ReferentielLifecycleDto {
  sousSystemeId: string;
  code: string;
  libelle: string;
  libelleCourt?: string;
  libelleEn?: string;
  domaine: DomaineMatiere;
  typeMatiere: TypeMatiere;
  baremeParDefaut: number;
  description?: string;
}

export interface MatiereReferentielNiveauDto extends ReferentielLifecycleDto {
  matiereReferentielId: string;
  niveauId: string;
  serieId?: string;
  estObligatoire: boolean;
  coefficientSuggere?: number;
  sourceCoefficient?: string;
  baremeSpecifique?: number;
  description?: string;
}

export interface AuditEntryDto {
  id: string;
  typeEntite: string;
  entiteId: string;
  operation: OperationAudit;
  utilisateurId: string;
  horodatage: string;
  valeursAvant: Record<string, unknown> | null;
  valeursApres: Record<string, unknown> | null;
  motif: string | null;
}
