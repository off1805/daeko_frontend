import type {
  DomaineMatiere,
  TypeMatiere,
} from "~/modules/referentiel/domain/entities/catalogue-matieres.entity";
import type {
  EtatAnnee,
  EtatBranche,
  EtatConfiguration,
  EtatElementLocal,
  OperationAuditSp,
} from "~/modules/structure-pedagogique/domain/shared/etats";

/**
 * DTOs de lecture exposés à la présentation : forme JS idiomatique
 * (camelCase, à plat), sur le modèle de referentiel-read.dto.ts. Restent
 * volontairement en IDs bruts pour les références croisées (niveauId,
 * serieId, matiereReferentielId...) — la résolution des libellés lisibles
 * se fait côté présentation via les hooks déjà exposés par le référentiel,
 * pour ne pas coupler cette couche à un autre module (voir ARCHITECTURE.md).
 */

export interface BrancheDto {
  id: string;
  sousSystemeId: string;
  ordreEnseignementId: string;
  typeEnseignementId: string;
  libelle: string;
  etat: EtatBranche;
  motifArchivage?: string;
  dateCreation: string;
  dateModification: string;
}

export interface MatiereLocaleDto {
  id: string;
  brancheId: string;
  code: string;
  libelle: string;
  libelleCourt?: string;
  libelleEn?: string;
  domaine: DomaineMatiere;
  typeMatiere: TypeMatiere;
  baremeParDefaut: number;
  etat: EtatElementLocal;
  motifDepreciation: string | null;
}

export interface AnneeAcademiqueDto {
  id: string;
  libelle: string;
  dateDebut: string;
  dateFin: string;
  etat: EtatAnnee;
  dateDemarrage: string | null;
  dateCloture: string | null;
}

export interface ConfigurationBrancheAnneeDto {
  id: string;
  brancheId: string;
  anneeAcademiqueId: string;
  etat: EtatConfiguration;
  dupliqueeDepuisId: string | null;
}

export interface FiliereActiveDto {
  id: string;
  configurationId: string;
  filiereId: string;
}

export interface NiveauActiveDto {
  id: string;
  configurationId: string;
  niveauId: string;
}

export interface SerieActiveDto {
  id: string;
  niveauActiveId: string;
  serieId: string;
}

export interface MatiereActiveDto {
  id: string;
  niveauActiveId: string;
  serieActiveId?: string;
  matiereReferentielId?: string;
  matiereLocaleId?: string;
  coefficient: number;
  bareme?: number;
  estObligatoire: boolean;
}

export interface ClasseDto {
  id: string;
  configurationId: string;
  niveauActiveId: string;
  serieActiveId?: string;
  suffixe: string;
  libelleComplet: string;
  effectifPrevu?: number;
  salle?: string;
  enseignantPrincipalId?: string;
  actif: boolean;
}

export interface AuditStructureDto {
  id: string;
  operation: OperationAuditSp;
  cibleType: string;
  cibleId: string;
  utilisateurId: string;
  horodatage: string;
  valeursAvant: Record<string, unknown> | null;
  valeursApres: Record<string, unknown> | null;
  motif: string | null;
}

export interface ConfigurationDetailDto {
  configuration: ConfigurationBrancheAnneeDto;
  filieresActives: FiliereActiveDto[];
  niveauxActifs: NiveauActiveDto[];
  seriesActives: SerieActiveDto[];
  matieresActives: MatiereActiveDto[];
  classes: ClasseDto[];
}

// ---------------------------------------------------------------------------
// Tableau de bord — DTO composé propre à l'écran "Ma structure" (doc vision
// UX) : c'est ici, pas côté présentation, que se décide le mode affiché.
// ---------------------------------------------------------------------------

export type ModeTableauDeBord = "ONBOARDING" | "RENTREE" | "STABLE";

export interface ProgressionConfigurationDto {
  filieresActivees: number;
  niveauxActives: number;
  seriesActives: number;
  matieresActives: number;
  classesCreees: number;
}

export interface BrancheTableauDeBordDto {
  branche: BrancheDto;
  configuration: ConfigurationBrancheAnneeDto | null;
  aUneConfigurationAnneePrecedente: boolean;
  progression: ProgressionConfigurationDto | null;
}

export interface TableauDeBordDto {
  mode: ModeTableauDeBord;
  anneeCourante: AnneeAcademiqueDto | null;
  anneePrecedente: AnneeAcademiqueDto | null;
  branches: BrancheTableauDeBordDto[];
}
