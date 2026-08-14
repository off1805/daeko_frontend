import type {
  DomaineMatiere,
  TypeMatiere,
} from "~/modules/referentiel/domain/entities/catalogue-matieres.entity";
import type { Branche } from "~/modules/structure-pedagogique/domain/entities/branche.entity";
import type { MatiereLocale } from "~/modules/structure-pedagogique/domain/entities/matiere-locale.entity";
import type { AnneeAcademique } from "~/modules/structure-pedagogique/domain/entities/annee-academique.entity";
import type { ConfigurationBrancheAnnee } from "~/modules/structure-pedagogique/domain/entities/configuration-branche-annee.entity";
import type {
  FiliereActive,
  NiveauActive,
  SerieActive,
} from "~/modules/structure-pedagogique/domain/entities/activation.entity";
import type { MatiereActive } from "~/modules/structure-pedagogique/domain/entities/matiere-active.entity";
import type { Classe } from "~/modules/structure-pedagogique/domain/entities/classe.entity";
import type { AuditStructure } from "~/modules/structure-pedagogique/domain/entities/audit-structure.entity";

// ---------------------------------------------------------------------------
// 3.2 — Branche
// ---------------------------------------------------------------------------

export interface CreateBrancheInput {
  sousSystemeId: string;
  ordreEnseignementId: string;
  typeEnseignementId: string;
  libelle?: string; // auto-généré si absent (doc 5.1)
}

export interface BrancheRepository {
  list(): Promise<Branche[]>;
  getById(id: string): Promise<Branche | null>;
  create(input: CreateBrancheInput, auteurId: string): Promise<Branche>;
  modifierLibelle(id: string, libelle: string, auteurId: string): Promise<Branche>;
  activer(id: string, auteurId: string): Promise<Branche>;
  suspendre(id: string, auteurId: string): Promise<Branche>;
  reactiver(id: string, auteurId: string): Promise<Branche>;
  archiver(id: string, motif: string, auteurId: string): Promise<Branche>;
}

// ---------------------------------------------------------------------------
// 3.3 — Matière locale
// ---------------------------------------------------------------------------

export interface CreateMatiereLocaleInput {
  brancheId: string;
  code: string;
  libelle: string;
  libelleCourt?: string;
  libelleEn?: string;
  domaine: DomaineMatiere;
  typeMatiere: TypeMatiere;
  baremeParDefaut?: number;
}

export interface MatiereLocaleRepository {
  listByBranche(
    brancheId: string,
    options?: { etat?: "ACTIVE" | "TOUS" },
  ): Promise<MatiereLocale[]>;
  getById(id: string): Promise<MatiereLocale | null>;
  create(input: CreateMatiereLocaleInput, auteurId: string): Promise<MatiereLocale>;
  deprecier(id: string, motif: string, auteurId: string): Promise<MatiereLocale>;
}

// ---------------------------------------------------------------------------
// 3.4 — Année académique
// ---------------------------------------------------------------------------

export interface CreateAnneeAcademiqueInput {
  libelle: string;
  dateDebut: string;
  dateFin: string;
}

export interface AnneeAcademiqueRepository {
  list(): Promise<AnneeAcademique[]>;
  getById(id: string): Promise<AnneeAcademique | null>;
  create(input: CreateAnneeAcademiqueInput, auteurId: string): Promise<AnneeAcademique>;
  demarrer(id: string, auteurId: string): Promise<AnneeAcademique>;
  /**
   * Irréversible : scelle en cascade toutes les configurations de l'année
   * (doc POST /{id}/cloturer). `confirmation` doit égaler le libellé de
   * l'année — "pour éviter le clic malheureux" (doc 5.2).
   */
  cloturer(id: string, confirmation: string, auteurId: string): Promise<AnneeAcademique>;
}

// ---------------------------------------------------------------------------
// 3.5 à 3.7 — Configuration et activations (le cœur du module)
// ---------------------------------------------------------------------------

export interface CreerConfigurationInput {
  brancheId: string;
  anneeAcademiqueId: string;
  dupliquerDepuisPrecedente: boolean;
  copierClasses: boolean;
}

export interface RapportDuplicationElementIgnore {
  type: "filiere" | "niveau" | "serie" | "matiere";
  code: string;
  raison: string;
}

export interface RapportDuplication {
  filieresCopiees: number;
  niveauxCopies: number;
  seriesCopiees: number;
  matieresCopiees: number;
  classesCopiees: number;
  elementsIgnores: RapportDuplicationElementIgnore[];
}

export interface CreerConfigurationResult {
  configuration: ConfigurationBrancheAnnee;
  rapport: RapportDuplication | null;
}

export interface MatiereActiveInput {
  /** Présent = ligne existante (mise à jour) ; absent = nouvelle ligne. */
  id?: string;
  matiereReferentielId?: string;
  matiereLocaleId?: string;
  serieActiveId?: string;
  coefficient: number;
  bareme?: number;
  estObligatoire?: boolean;
}

export interface ResultatDifferentiel {
  ajoutees: number;
  modifiees: number;
  inchangees: number;
  retirees: number;
}

export interface ConfigurationDetail {
  configuration: ConfigurationBrancheAnnee;
  filieresActives: FiliereActive[];
  niveauxActifs: NiveauActive[];
  seriesActives: SerieActive[];
  matieresActives: MatiereActive[];
  classes: Classe[];
}

export interface CorrigerCoefficientInput {
  nouveauCoefficient: number;
  motif: string;
}

export interface ConfigurationRepository {
  getByBrancheEtAnnee(
    brancheId: string,
    anneeAcademiqueId: string,
  ): Promise<ConfigurationBrancheAnnee | null>;
  listByBranche(brancheId: string): Promise<ConfigurationBrancheAnnee[]>;
  getDetail(id: string): Promise<ConfigurationDetail | null>;
  creer(
    input: CreerConfigurationInput,
    auteurId: string,
  ): Promise<CreerConfigurationResult>;
  /** État cible complet, différentiel calculé côté repository (doc "Écritures en masse"). */
  mettreAJourFilieres(
    configurationId: string,
    filiereIds: string[],
    auteurId: string,
  ): Promise<ResultatDifferentiel>;
  mettreAJourNiveaux(
    configurationId: string,
    niveauIds: string[],
    auteurId: string,
  ): Promise<ResultatDifferentiel>;
  mettreAJourSeries(
    niveauActiveId: string,
    serieIds: string[],
    auteurId: string,
  ): Promise<ResultatDifferentiel>;
  mettreAJourMatieres(
    niveauActiveId: string,
    matieres: MatiereActiveInput[],
    auteurId: string,
  ): Promise<ResultatDifferentiel>;
  /** Geste rare permanent (v1 simplifié, voir le plan) : édite le coefficient d'une matière active existante avec motif obligatoire. */
  corrigerCoefficient(
    matiereActiveId: string,
    input: CorrigerCoefficientInput,
    auteurId: string,
  ): Promise<MatiereActive>;
}

// ---------------------------------------------------------------------------
// 3.8 — Classe
// ---------------------------------------------------------------------------

export interface CreerClasseInput {
  niveauActiveId: string;
  serieActiveId?: string;
  /** Un seul suffixe = création unitaire. */
  suffixe?: string;
  /** Plusieurs suffixes = création en série (doc 5.4). */
  suffixes?: string[];
  effectifPrevu?: number;
  salle?: string;
}

export interface ModifierClasseInput {
  suffixe?: string;
  effectifPrevu?: number;
  salle?: string;
  enseignantPrincipalId?: string;
}

export interface ClasseFilters {
  niveauActiveId?: string;
  serieActiveId?: string;
  actif?: boolean;
}

export interface ClasseRepository {
  list(configurationId: string, filters?: ClasseFilters): Promise<Classe[]>;
  /** Retourne toutes les classes créées (une seule en mode unitaire, plusieurs en mode série). */
  creer(
    configurationId: string,
    input: CreerClasseInput,
    auteurId: string,
  ): Promise<Classe[]>;
  modifier(id: string, input: ModifierClasseInput, auteurId: string): Promise<Classe>;
  /** Vérification croisée Personnes stubbée "zéro inscription" tant que ce module n'existe pas (doc 9.7). */
  desactiver(id: string, motif: string, auteurId: string): Promise<Classe>;
  reactiver(id: string, auteurId: string): Promise<Classe>;
}

// ---------------------------------------------------------------------------
// 3.9 — Audit (lecture seule)
// ---------------------------------------------------------------------------

export interface AuditStructureFilters {
  cibleType?: string;
  cibleId?: string;
  operation?: string;
  /** Bornes ISO (horodatage), inclusives. */
  du?: string;
  au?: string;
}

export interface AuditStructureRepository {
  list(filters?: AuditStructureFilters): Promise<AuditStructure[]>;
}
