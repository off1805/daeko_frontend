import type { EtatReferentiel } from "~/modules/referentiel/domain/shared/etat-referentiel";
import type {
  SousSysteme,
  OrdreEnseignement,
  TypeEnseignement,
} from "~/modules/referentiel/domain/entities/tables-racines.entity";
import type {
  Cycle,
  Niveau,
} from "~/modules/referentiel/domain/entities/chaine-temporelle.entity";
import type {
  Filiere,
  Serie,
} from "~/modules/referentiel/domain/entities/chaine-pedagogique.entity";
import type {
  DomaineMatiere,
  MatiereReferentiel,
  MatiereReferentielNiveau,
  TypeMatiere,
} from "~/modules/referentiel/domain/entities/catalogue-matieres.entity";
import type { AuditEntry } from "~/modules/referentiel/domain/entities/audit-entry.entity";

// ---------------------------------------------------------------------------
// Port générique (doc section 5 : mêmes verbes pour toutes les ressources
// sauf /audit). Un seul contrat, réutilisé pour les 9 ressources CRUD —
// évite de dupliquer 9 fois une interface list/getById/create/update/deprecier
// structurellement identique.
// ---------------------------------------------------------------------------

export interface PaginationParams {
  page?: number;
  taille?: number;
}

export interface PaginatedResult<T> {
  donnees: T[];
  page: number;
  taille: number;
  total: number;
}

export interface ReferentielFilters {
  /** Défaut ACTIVE côté repository ; TOUS inclut aussi les entrées dépréciées. */
  etat?: EtatReferentiel | "TOUS";
  recherche?: string;
}

export interface ReferentielRepository<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TFilters extends ReferentielFilters = ReferentielFilters,
> {
  list(
    filters: TFilters & PaginationParams,
  ): Promise<PaginatedResult<TEntity>>;
  getById(id: string): Promise<TEntity | null>;
  /** @param auteurId correspond à cree_par — fourni par l'appelant (pas de FK inter-modules vers Identité & Accès, voir doc 3.2). */
  create(input: TCreateInput, auteurId: string): Promise<TEntity>;
  update(id: string, input: TUpdateInput, auteurId: string): Promise<TEntity>;
  /** REF-012 : si déjà DEPRECATED, retourne l'entrée telle quelle sans erreur. */
  deprecier(
    id: string,
    motif: string,
    auteurId: string,
    dateEffet?: string,
  ): Promise<TEntity>;
}

export interface AuditFilters {
  typeEntite?: string;
  entiteId?: string;
  utilisateurId?: string;
  du?: string;
  au?: string;
}

/** /audit est réservé SUPER_ADMIN et strictement en lecture (doc 5.1, 3.7). */
export interface AuditRepository {
  list(
    filters: AuditFilters & PaginationParams,
  ): Promise<PaginatedResult<AuditEntry>>;
}

// ---------------------------------------------------------------------------
// 3.3 — Tables racines
// ---------------------------------------------------------------------------

export interface SousSystemeFilters extends ReferentielFilters {}

export interface CreateSousSystemeInput {
  code: string;
  libelle: string;
  libelleCourt?: string;
  description?: string;
  languePrincipale: string;
}

export type UpdateSousSystemeInput = Partial<CreateSousSystemeInput>;

export type SousSystemeRepository = ReferentielRepository<
  SousSysteme,
  CreateSousSystemeInput,
  UpdateSousSystemeInput,
  SousSystemeFilters
>;

export interface OrdreEnseignementFilters extends ReferentielFilters {}

export interface CreateOrdreEnseignementInput {
  code: string;
  libelle: string;
  tutelleMinisterielle?: string;
  tutelleMinisterielleEn?: string;
  rang: number;
  description?: string;
}

export type UpdateOrdreEnseignementInput =
  Partial<CreateOrdreEnseignementInput>;

export type OrdreEnseignementRepository = ReferentielRepository<
  OrdreEnseignement,
  CreateOrdreEnseignementInput,
  UpdateOrdreEnseignementInput,
  OrdreEnseignementFilters
>;

export interface TypeEnseignementFilters extends ReferentielFilters {}

export interface CreateTypeEnseignementInput {
  code: string;
  libelle: string;
  description?: string;
}

export type UpdateTypeEnseignementInput = Partial<CreateTypeEnseignementInput>;

export type TypeEnseignementRepository = ReferentielRepository<
  TypeEnseignement,
  CreateTypeEnseignementInput,
  UpdateTypeEnseignementInput,
  TypeEnseignementFilters
>;

// ---------------------------------------------------------------------------
// 3.4 — Chaîne temporelle : cycle, niveau
// ---------------------------------------------------------------------------

export interface CycleFilters extends ReferentielFilters {
  sousSystemeId?: string;
  ordreEnseignementId?: string;
}

export interface CreateCycleInput {
  sousSystemeId: string;
  ordreEnseignementId: string;
  code: string;
  libelle: string;
  libelleEn?: string;
  rang: number;
  dureeTheoriqueAnnees: number;
  description?: string;
}

// sousSystemeId / ordreEnseignementId : références structurelles, non
// modifiables en flux standard (REF-008) — absentes du type Update.
export type UpdateCycleInput = Partial<
  Omit<CreateCycleInput, "sousSystemeId" | "ordreEnseignementId">
>;

export type CycleRepository = ReferentielRepository<
  Cycle,
  CreateCycleInput,
  UpdateCycleInput,
  CycleFilters
>;

export interface NiveauFilters extends ReferentielFilters {
  cycleId?: string;
}

export interface CreateNiveauInput {
  cycleId: string;
  code: string;
  libelle: string;
  libelleCourt?: string;
  libelleEn?: string;
  rangDansCycle: number;
  ageTheoriqueDebut?: number;
  description?: string;
}

export type UpdateNiveauInput = Partial<Omit<CreateNiveauInput, "cycleId">>;

export type NiveauRepository = ReferentielRepository<
  Niveau,
  CreateNiveauInput,
  UpdateNiveauInput,
  NiveauFilters
>;

// ---------------------------------------------------------------------------
// 3.5 — Chaîne pédagogique : filière, série
// ---------------------------------------------------------------------------

export interface FiliereFilters extends ReferentielFilters {
  ordreEnseignementId?: string;
  typeEnseignementId?: string;
}

export interface CreateFiliereInput {
  ordreEnseignementId: string;
  typeEnseignementId: string;
  code: string;
  libelle: string;
  libelleEn?: string;
  description?: string;
}

export type UpdateFiliereInput = Partial<
  Omit<CreateFiliereInput, "ordreEnseignementId" | "typeEnseignementId">
>;

export type FiliereRepository = ReferentielRepository<
  Filiere,
  CreateFiliereInput,
  UpdateFiliereInput,
  FiliereFilters
>;

export interface SerieFilters extends ReferentielFilters {
  filiereId?: string;
  /** Ne renvoie que les séries dont le niveau d'apparition est compatible avec ce niveau (doc 5.1). */
  niveauId?: string;
}

export interface CreateSerieInput {
  filiereId: string;
  niveauApparitionId: string;
  code: string;
  libelle: string;
  libelleCourt?: string;
  libelleEn?: string;
  description?: string;
}

export type UpdateSerieInput = Partial<
  Omit<CreateSerieInput, "filiereId" | "niveauApparitionId">
>;

export type SerieRepository = ReferentielRepository<
  Serie,
  CreateSerieInput,
  UpdateSerieInput,
  SerieFilters
>;

// ---------------------------------------------------------------------------
// 3.6 — Catalogue des matières
// ---------------------------------------------------------------------------

export interface MatiereReferentielFilters extends ReferentielFilters {
  sousSystemeId?: string;
  domaine?: DomaineMatiere;
  typeMatiere?: TypeMatiere;
}

export interface CreateMatiereReferentielInput {
  sousSystemeId: string;
  code: string;
  libelle: string;
  libelleCourt?: string;
  libelleEn?: string;
  domaine: DomaineMatiere;
  typeMatiere: TypeMatiere;
  baremeParDefaut?: number;
  description?: string;
}

export type UpdateMatiereReferentielInput = Partial<
  Omit<CreateMatiereReferentielInput, "sousSystemeId">
>;

export type MatiereReferentielRepository = ReferentielRepository<
  MatiereReferentiel,
  CreateMatiereReferentielInput,
  UpdateMatiereReferentielInput,
  MatiereReferentielFilters
>;

export interface MatiereReferentielNiveauFilters extends ReferentielFilters {
  /** Obligatoire côté API (doc 5.1). */
  niveauId: string;
  /** Si fourni : renvoie les lignes de cette série ET les lignes sans série. */
  serieId?: string;
}

export interface CreateMatiereReferentielNiveauInput {
  matiereReferentielId: string;
  niveauId: string;
  serieId?: string;
  estObligatoire?: boolean;
  coefficientSuggere?: number;
  sourceCoefficient?: string;
  baremeSpecifique?: number;
  description?: string;
}

export type UpdateMatiereReferentielNiveauInput = Partial<
  Omit<
    CreateMatiereReferentielNiveauInput,
    "matiereReferentielId" | "niveauId" | "serieId"
  >
>;

export type MatiereReferentielNiveauRepository = ReferentielRepository<
  MatiereReferentielNiveau,
  CreateMatiereReferentielNiveauInput,
  UpdateMatiereReferentielNiveauInput,
  MatiereReferentielNiveauFilters
>;
