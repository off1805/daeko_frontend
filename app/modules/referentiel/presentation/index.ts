/**
 * Surface publique du module Référentiel. Les pages (à venir) ne doivent
 * importer que depuis ce barrel — jamais directement depuis domain/
 * application/infrastructure (voir ARCHITECTURE.md à la racine).
 */

export type {
  ReferentielLifecycleDto,
  SousSystemeDto,
  OrdreEnseignementDto,
  TypeEnseignementDto,
  CycleDto,
  NiveauDto,
  FiliereDto,
  SerieDto,
  MatiereReferentielDto,
  MatiereReferentielNiveauDto,
  AuditEntryDto,
} from "~/modules/referentiel/application/dto/referentiel-read.dto";

export type { DomaineMatiere, TypeMatiere } from "~/modules/referentiel/domain/entities/catalogue-matieres.entity";
export type { OperationAudit } from "~/modules/referentiel/domain/entities/audit-entry.entity";
export type { EtatReferentiel } from "~/modules/referentiel/domain/shared/etat-referentiel";

export type {
  PaginationParams,
  PaginatedResult,
  ReferentielFilters,
  AuditFilters,
  SousSystemeFilters,
  CreateSousSystemeInput,
  UpdateSousSystemeInput,
  OrdreEnseignementFilters,
  CreateOrdreEnseignementInput,
  UpdateOrdreEnseignementInput,
  TypeEnseignementFilters,
  CreateTypeEnseignementInput,
  UpdateTypeEnseignementInput,
  CycleFilters,
  CreateCycleInput,
  UpdateCycleInput,
  NiveauFilters,
  CreateNiveauInput,
  UpdateNiveauInput,
  FiliereFilters,
  CreateFiliereInput,
  UpdateFiliereInput,
  SerieFilters,
  CreateSerieInput,
  UpdateSerieInput,
  MatiereReferentielFilters,
  CreateMatiereReferentielInput,
  UpdateMatiereReferentielInput,
  MatiereReferentielNiveauFilters,
  CreateMatiereReferentielNiveauInput,
  UpdateMatiereReferentielNiveauInput,
} from "~/modules/referentiel/domain/repositories/referentiel.repository";

export * as ReferentielErrors from "~/modules/referentiel/domain/errors/referentiel.errors";

export {
  sousSystemeQueries,
  ordreEnseignementQueries,
  typeEnseignementQueries,
  cycleQueries,
  niveauQueries,
  filiereQueries,
  serieQueries,
  matiereReferentielQueries,
  matiereReferentielNiveauQueries,
  useAllMatiereReferentielNiveauEntries,
  useAuditEntries,
} from "~/modules/referentiel/infrastructure/queries/referentiel.queries";

export {
  referentielNavSections,
  referentielNavItemsFlat,
  type ReferentielNavItem,
  type ReferentielNavSection,
  type ReferentielSectionKey,
} from "~/modules/referentiel/presentation/nav";

export { SystemeEnseignementSection } from "~/modules/referentiel/presentation/components/sections/systeme-enseignement-section";
export { CyclesSection } from "~/modules/referentiel/presentation/components/sections/cycles-section";
export { NiveauxSection } from "~/modules/referentiel/presentation/components/sections/niveaux-section";
export { FilieresSection } from "~/modules/referentiel/presentation/components/sections/filieres-section";
export { SeriesSection } from "~/modules/referentiel/presentation/components/sections/series-section";
export { MatieresSection } from "~/modules/referentiel/presentation/components/sections/matieres-section";
export { AffectationsMatieresSection } from "~/modules/referentiel/presentation/components/sections/affectations-matieres-section";
