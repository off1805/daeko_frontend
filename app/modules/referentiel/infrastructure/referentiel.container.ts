import { LibelleBilingue } from "~/modules/referentiel/domain/shared/libelle-bilingue.vo";
import {
  OrdreEnseignement,
  SousSysteme,
  TypeEnseignement,
} from "~/modules/referentiel/domain/entities/tables-racines.entity";
import {
  Cycle,
  Niveau,
} from "~/modules/referentiel/domain/entities/chaine-temporelle.entity";
import {
  Filiere,
  Serie,
} from "~/modules/referentiel/domain/entities/chaine-pedagogique.entity";
import {
  MatiereReferentiel,
  MatiereReferentielNiveau,
} from "~/modules/referentiel/domain/entities/catalogue-matieres.entity";
import { ReferentielValidationService } from "~/modules/referentiel/domain/services/referentiel-validation.service";
import type {
  CreateCycleInput,
  CreateFiliereInput,
  CreateMatiereReferentielInput,
  CreateMatiereReferentielNiveauInput,
  CreateNiveauInput,
  CreateOrdreEnseignementInput,
  CreateSerieInput,
  CreateSousSystemeInput,
  CreateTypeEnseignementInput,
  CycleFilters,
  FiliereFilters,
  MatiereReferentielFilters,
  MatiereReferentielNiveauFilters,
  NiveauFilters,
  OrdreEnseignementFilters,
  SerieFilters,
  SousSystemeFilters,
  TypeEnseignementFilters,
  UpdateCycleInput,
  UpdateFiliereInput,
  UpdateMatiereReferentielInput,
  UpdateMatiereReferentielNiveauInput,
  UpdateNiveauInput,
  UpdateOrdreEnseignementInput,
  UpdateSerieInput,
  UpdateSousSystemeInput,
  UpdateTypeEnseignementInput,
} from "~/modules/referentiel/domain/repositories/referentiel.repository";
import {
  createInMemoryReferentielRepository,
  type EntityMeta,
} from "~/modules/referentiel/infrastructure/repositories/in-memory-referentiel.repository";
import { createMockAuditRepository } from "~/modules/referentiel/infrastructure/repositories/mock-audit.repository";
import {
  auditSeed,
  cyclesSeed,
  filieresSeed,
  matieresReferentielNiveauSeed,
  matieresReferentielSeed,
  niveauxSeed,
  ordresEnseignementSeed,
  seriesSeed,
  sousSystemesSeed,
  typesEnseignementSeed,
} from "~/modules/referentiel/infrastructure/mock-data/referentiel.seed-data";
import {
  toCycleDto,
  toFiliereDto,
  toMatiereReferentielDto,
  toMatiereReferentielNiveauDto,
  toNiveauDto,
  toOrdreEnseignementDto,
  toSerieDto,
  toSousSystemeDto,
  toTypeEnseignementDto,
} from "~/modules/referentiel/application/mappers/referentiel.mappers";
import { ListReferentielEntriesUseCase } from "~/modules/referentiel/application/use-cases/generic/list-referentiel-entries.use-case";
import { GetReferentielEntryByIdUseCase } from "~/modules/referentiel/application/use-cases/generic/get-referentiel-entry-by-id.use-case";
import { CreateReferentielEntryUseCase } from "~/modules/referentiel/application/use-cases/generic/create-referentiel-entry.use-case";
import { UpdateReferentielEntryUseCase } from "~/modules/referentiel/application/use-cases/generic/update-referentiel-entry.use-case";
import { DeprecierReferentielEntryUseCase } from "~/modules/referentiel/application/use-cases/generic/deprecier-referentiel-entry.use-case";
import { ListAuditEntriesUseCase } from "~/modules/referentiel/application/use-cases/list-audit-entries.use-case";

// Stores en mémoire : partagés par référence entre repositories pour
// permettre les jointures de lecture (filtres) et les vérifications
// croisées à l'écriture (REF-002/003/004/006/011). Remplacés plus tard par
// de vrais appels axios, un repository à la fois (voir infrastructure/http).
const stores = {
  sousSystemes: [...sousSystemesSeed],
  ordresEnseignement: [...ordresEnseignementSeed],
  typesEnseignement: [...typesEnseignementSeed],
  cycles: [...cyclesSeed],
  niveaux: [...niveauxSeed],
  filieres: [...filieresSeed],
  series: [...seriesSeed],
  matieresReferentiel: [...matieresReferentielSeed],
  matieresReferentielNiveau: [...matieresReferentielNiveauSeed],
  audit: [...auditSeed],
};

function correspondRecherche(
  recherche: string | undefined,
  ...valeurs: (string | undefined)[]
): boolean {
  if (!recherche) return true;
  const cible = recherche.trim().toLowerCase();
  if (!cible) return true;
  return valeurs.some((valeur) => valeur?.toLowerCase().includes(cible));
}

function positionNiveau(niveau: Niveau): { rangCycle: number; rangDansCycle: number } | undefined {
  const cycle = stores.cycles.find((c) => c.id === niveau.cycleId);
  if (!cycle) return undefined;
  return { rangCycle: cycle.rang, rangDansCycle: niveau.rangDansCycle };
}

function positionEstAnterieure(
  a: { rangCycle: number; rangDansCycle: number },
  b: { rangCycle: number; rangDansCycle: number },
): boolean {
  if (a.rangCycle !== b.rangCycle) return a.rangCycle < b.rangCycle;
  return a.rangDansCycle < b.rangDansCycle;
}

// ---------------------------------------------------------------------------
// 3.3 — Tables racines
// ---------------------------------------------------------------------------

const sousSystemeRepository = createInMemoryReferentielRepository<
  SousSysteme,
  CreateSousSystemeInput,
  UpdateSousSystemeInput,
  SousSystemeFilters
>({
  store: stores.sousSystemes,
  uniqueKey: (props) => props.code,
  matchesFilters: (entity, filters) =>
    correspondRecherche(filters.recherche, entity.code, entity.libelle, entity.libelleCourt),
  fromProps: (id, props) => SousSysteme.create(props, id),
  mapCreateInput: (input, meta: EntityMeta) => ({
    code: input.code,
    libelle: input.libelle,
    libelleCourt: input.libelleCourt,
    description: input.description,
    languePrincipale: input.languePrincipale,
    etat: "ACTIVE" as const,
    dateEntreeVigueur: meta.now.slice(0, 10),
    dateDepreciation: null,
    motifDepreciation: null,
    dateCreation: meta.now,
    dateModification: meta.now,
    creePar: meta.auteurId,
    modifiePar: meta.auteurId,
  }),
  mapUpdateInput: (existing, input, meta: EntityMeta) => ({
    ...existing,
    code: input.code ?? existing.code,
    libelle: input.libelle ?? existing.libelle,
    libelleCourt: input.libelleCourt ?? existing.libelleCourt,
    description: input.description ?? existing.description,
    languePrincipale: input.languePrincipale ?? existing.languePrincipale,
    dateModification: meta.now,
    modifiePar: meta.auteurId,
  }),
});

const ordreEnseignementRepository = createInMemoryReferentielRepository<
  OrdreEnseignement,
  CreateOrdreEnseignementInput,
  UpdateOrdreEnseignementInput,
  OrdreEnseignementFilters
>({
  store: stores.ordresEnseignement,
  uniqueKey: (props) => props.code,
  matchesFilters: (entity, filters) =>
    correspondRecherche(filters.recherche, entity.code, entity.libelle),
  fromProps: (id, props) => OrdreEnseignement.create(props, id),
  mapCreateInput: (input, meta: EntityMeta) => ({
    code: input.code,
    libelle: input.libelle,
    tutelleMinisterielle: input.tutelleMinisterielle
      ? LibelleBilingue.create(
          input.tutelleMinisterielle,
          input.tutelleMinisterielleEn,
        )
      : undefined,
    rang: input.rang,
    description: input.description,
    etat: "ACTIVE" as const,
    dateEntreeVigueur: meta.now.slice(0, 10),
    dateDepreciation: null,
    motifDepreciation: null,
    dateCreation: meta.now,
    dateModification: meta.now,
    creePar: meta.auteurId,
    modifiePar: meta.auteurId,
  }),
  mapUpdateInput: (existing, input, meta: EntityMeta) => {
    const tutelleFr = input.tutelleMinisterielle ?? existing.tutelleMinisterielle?.fr;
    const tutelleEn = input.tutelleMinisterielleEn ?? existing.tutelleMinisterielle?.en;
    return {
      ...existing,
      code: input.code ?? existing.code,
      libelle: input.libelle ?? existing.libelle,
      tutelleMinisterielle: tutelleFr
        ? LibelleBilingue.create(tutelleFr, tutelleEn)
        : undefined,
      rang: input.rang ?? existing.rang,
      description: input.description ?? existing.description,
      dateModification: meta.now,
      modifiePar: meta.auteurId,
    };
  },
});

const typeEnseignementRepository = createInMemoryReferentielRepository<
  TypeEnseignement,
  CreateTypeEnseignementInput,
  UpdateTypeEnseignementInput,
  TypeEnseignementFilters
>({
  store: stores.typesEnseignement,
  uniqueKey: (props) => props.code,
  matchesFilters: (entity, filters) =>
    correspondRecherche(filters.recherche, entity.code, entity.libelle),
  fromProps: (id, props) => TypeEnseignement.create(props, id),
  mapCreateInput: (input, meta: EntityMeta) => ({
    code: input.code,
    libelle: input.libelle,
    description: input.description,
    etat: "ACTIVE" as const,
    dateEntreeVigueur: meta.now.slice(0, 10),
    dateDepreciation: null,
    motifDepreciation: null,
    dateCreation: meta.now,
    dateModification: meta.now,
    creePar: meta.auteurId,
    modifiePar: meta.auteurId,
  }),
  mapUpdateInput: (existing, input, meta: EntityMeta) => ({
    ...existing,
    code: input.code ?? existing.code,
    libelle: input.libelle ?? existing.libelle,
    description: input.description ?? existing.description,
    dateModification: meta.now,
    modifiePar: meta.auteurId,
  }),
});

// ---------------------------------------------------------------------------
// 3.4 — Chaîne temporelle : cycle, niveau
// ---------------------------------------------------------------------------

const cycleRepository = createInMemoryReferentielRepository<
  Cycle,
  CreateCycleInput,
  UpdateCycleInput,
  CycleFilters
>({
  store: stores.cycles,
  uniqueKey: (props) => `${props.sousSystemeId}:${props.ordreEnseignementId}:${props.code}`,
  matchesFilters: (entity, filters) =>
    (!filters.sousSystemeId || entity.sousSystemeId === filters.sousSystemeId) &&
    (!filters.ordreEnseignementId || entity.ordreEnseignementId === filters.ordreEnseignementId),
  fromProps: (id, props) => Cycle.create(props, id),
  validateCreate: (input) => {
    const sousSysteme = stores.sousSystemes.find((s) => s.id === input.sousSystemeId);
    const ordre = stores.ordresEnseignement.find((o) => o.id === input.ordreEnseignementId);
    ReferentielValidationService.validerParentActif(sousSysteme, "sous-système");
    ReferentielValidationService.validerParentActif(ordre, "ordre d'enseignement");
  },
  mapCreateInput: (input, meta: EntityMeta) => ({
    sousSystemeId: input.sousSystemeId,
    ordreEnseignementId: input.ordreEnseignementId,
    code: input.code,
    libelle: LibelleBilingue.create(input.libelle, input.libelleEn),
    rang: input.rang,
    dureeTheoriqueAnnees: input.dureeTheoriqueAnnees,
    description: input.description,
    etat: "ACTIVE" as const,
    dateEntreeVigueur: meta.now.slice(0, 10),
    dateDepreciation: null,
    motifDepreciation: null,
    dateCreation: meta.now,
    dateModification: meta.now,
    creePar: meta.auteurId,
    modifiePar: meta.auteurId,
  }),
  mapUpdateInput: (existing, input, meta: EntityMeta) => ({
    ...existing,
    code: input.code ?? existing.code,
    libelle: LibelleBilingue.create(
      input.libelle ?? existing.libelle.fr,
      input.libelleEn ?? existing.libelle.en,
    ),
    rang: input.rang ?? existing.rang,
    dureeTheoriqueAnnees: input.dureeTheoriqueAnnees ?? existing.dureeTheoriqueAnnees,
    description: input.description ?? existing.description,
    dateModification: meta.now,
    modifiePar: meta.auteurId,
  }),
});

const niveauRepository = createInMemoryReferentielRepository<
  Niveau,
  CreateNiveauInput,
  UpdateNiveauInput,
  NiveauFilters
>({
  store: stores.niveaux,
  uniqueKey: (props) => `${props.cycleId}:${props.code}`,
  matchesFilters: (entity, filters) =>
    !filters.cycleId || entity.cycleId === filters.cycleId,
  fromProps: (id, props) => Niveau.create(props, id),
  validateCreate: (input) => {
    const cycle = stores.cycles.find((c) => c.id === input.cycleId);
    ReferentielValidationService.validerParentActif(cycle, "cycle");
  },
  mapCreateInput: (input, meta: EntityMeta) => ({
    cycleId: input.cycleId,
    code: input.code,
    libelle: LibelleBilingue.create(input.libelle, input.libelleEn),
    libelleCourt: input.libelleCourt,
    rangDansCycle: input.rangDansCycle,
    ageTheoriqueDebut: input.ageTheoriqueDebut,
    description: input.description,
    etat: "ACTIVE" as const,
    dateEntreeVigueur: meta.now.slice(0, 10),
    dateDepreciation: null,
    motifDepreciation: null,
    dateCreation: meta.now,
    dateModification: meta.now,
    creePar: meta.auteurId,
    modifiePar: meta.auteurId,
  }),
  mapUpdateInput: (existing, input, meta: EntityMeta) => ({
    ...existing,
    code: input.code ?? existing.code,
    libelle: LibelleBilingue.create(
      input.libelle ?? existing.libelle.fr,
      input.libelleEn ?? existing.libelle.en,
    ),
    libelleCourt: input.libelleCourt ?? existing.libelleCourt,
    rangDansCycle: input.rangDansCycle ?? existing.rangDansCycle,
    ageTheoriqueDebut: input.ageTheoriqueDebut ?? existing.ageTheoriqueDebut,
    description: input.description ?? existing.description,
    dateModification: meta.now,
    modifiePar: meta.auteurId,
  }),
});

// ---------------------------------------------------------------------------
// 3.5 — Chaîne pédagogique : filière, série
// ---------------------------------------------------------------------------

const filiereRepository = createInMemoryReferentielRepository<
  Filiere,
  CreateFiliereInput,
  UpdateFiliereInput,
  FiliereFilters
>({
  store: stores.filieres,
  uniqueKey: (props) => `${props.ordreEnseignementId}:${props.typeEnseignementId}:${props.code}`,
  matchesFilters: (entity, filters) =>
    (!filters.ordreEnseignementId || entity.ordreEnseignementId === filters.ordreEnseignementId) &&
    (!filters.typeEnseignementId || entity.typeEnseignementId === filters.typeEnseignementId),
  fromProps: (id, props) => Filiere.create(props, id),
  validateCreate: (input) => {
    const ordre = stores.ordresEnseignement.find((o) => o.id === input.ordreEnseignementId);
    const type = stores.typesEnseignement.find((t) => t.id === input.typeEnseignementId);
    ReferentielValidationService.validerParentActif(ordre, "ordre d'enseignement");
    ReferentielValidationService.validerParentActif(type, "type d'enseignement");
  },
  mapCreateInput: (input, meta: EntityMeta) => ({
    ordreEnseignementId: input.ordreEnseignementId,
    typeEnseignementId: input.typeEnseignementId,
    code: input.code,
    libelle: LibelleBilingue.create(input.libelle, input.libelleEn),
    description: input.description,
    etat: "ACTIVE" as const,
    dateEntreeVigueur: meta.now.slice(0, 10),
    dateDepreciation: null,
    motifDepreciation: null,
    dateCreation: meta.now,
    dateModification: meta.now,
    creePar: meta.auteurId,
    modifiePar: meta.auteurId,
  }),
  mapUpdateInput: (existing, input, meta: EntityMeta) => ({
    ...existing,
    code: input.code ?? existing.code,
    libelle: LibelleBilingue.create(
      input.libelle ?? existing.libelle.fr,
      input.libelleEn ?? existing.libelle.en,
    ),
    description: input.description ?? existing.description,
    dateModification: meta.now,
    modifiePar: meta.auteurId,
  }),
});

const serieRepository = createInMemoryReferentielRepository<
  Serie,
  CreateSerieInput,
  UpdateSerieInput,
  SerieFilters
>({
  store: stores.series,
  uniqueKey: (props) => `${props.filiereId}:${props.code}`,
  matchesFilters: (entity, filters) => {
    if (filters.filiereId && entity.filiereId !== filters.filiereId) return false;
    if (filters.niveauId) {
      const niveauCible = stores.niveaux.find((n) => n.id === filters.niveauId);
      const niveauApparition = stores.niveaux.find((n) => n.id === entity.niveauApparitionId);
      if (!niveauCible || !niveauApparition) return false;
      const positionCible = positionNiveau(niveauCible);
      const positionApparition = positionNiveau(niveauApparition);
      if (!positionCible || !positionApparition) return false;
      if (positionEstAnterieure(positionCible, positionApparition)) return false;
    }
    return true;
  },
  fromProps: (id, props) => Serie.create(props, id),
  validateCreate: (input) => {
    const filiere = stores.filieres.find((f) => f.id === input.filiereId);
    const niveauApparition = stores.niveaux.find((n) => n.id === input.niveauApparitionId);
    ReferentielValidationService.validerParentActif(filiere, "filière");
    ReferentielValidationService.validerParentActif(niveauApparition, "niveau d'apparition");
    if (filiere && niveauApparition) {
      const cycleApparition = stores.cycles.find((c) => c.id === niveauApparition.cycleId);
      if (cycleApparition) {
        ReferentielValidationService.validerCreationSerie({
          filiereOrdreEnseignementId: filiere.ordreEnseignementId,
          cycleApparitionOrdreEnseignementId: cycleApparition.ordreEnseignementId,
        });
      }
    }
  },
  mapCreateInput: (input, meta: EntityMeta) => ({
    filiereId: input.filiereId,
    niveauApparitionId: input.niveauApparitionId,
    code: input.code,
    libelle: LibelleBilingue.create(input.libelle, input.libelleEn),
    libelleCourt: input.libelleCourt,
    description: input.description,
    etat: "ACTIVE" as const,
    dateEntreeVigueur: meta.now.slice(0, 10),
    dateDepreciation: null,
    motifDepreciation: null,
    dateCreation: meta.now,
    dateModification: meta.now,
    creePar: meta.auteurId,
    modifiePar: meta.auteurId,
  }),
  mapUpdateInput: (existing, input, meta: EntityMeta) => ({
    ...existing,
    code: input.code ?? existing.code,
    libelle: LibelleBilingue.create(
      input.libelle ?? existing.libelle.fr,
      input.libelleEn ?? existing.libelle.en,
    ),
    libelleCourt: input.libelleCourt ?? existing.libelleCourt,
    description: input.description ?? existing.description,
    dateModification: meta.now,
    modifiePar: meta.auteurId,
  }),
});

// ---------------------------------------------------------------------------
// 3.6 — Catalogue des matières
// ---------------------------------------------------------------------------

const matiereReferentielRepository = createInMemoryReferentielRepository<
  MatiereReferentiel,
  CreateMatiereReferentielInput,
  UpdateMatiereReferentielInput,
  MatiereReferentielFilters
>({
  store: stores.matieresReferentiel,
  uniqueKey: (props) => `${props.sousSystemeId}:${props.code}`,
  matchesFilters: (entity, filters) =>
    (!filters.sousSystemeId || entity.sousSystemeId === filters.sousSystemeId) &&
    (!filters.domaine || entity.domaine === filters.domaine) &&
    (!filters.typeMatiere || entity.typeMatiere === filters.typeMatiere) &&
    correspondRecherche(filters.recherche, entity.code, entity.libelle.fr, entity.libelle.en),
  fromProps: (id, props) => MatiereReferentiel.create(props, id),
  validateCreate: (input) => {
    const sousSysteme = stores.sousSystemes.find((s) => s.id === input.sousSystemeId);
    ReferentielValidationService.validerParentActif(sousSysteme, "sous-système");
  },
  mapCreateInput: (input, meta: EntityMeta) => ({
    sousSystemeId: input.sousSystemeId,
    code: input.code,
    libelle: LibelleBilingue.create(input.libelle, input.libelleEn),
    libelleCourt: input.libelleCourt,
    domaine: input.domaine,
    typeMatiere: input.typeMatiere,
    baremeParDefaut: input.baremeParDefaut ?? 20,
    description: input.description,
    etat: "ACTIVE" as const,
    dateEntreeVigueur: meta.now.slice(0, 10),
    dateDepreciation: null,
    motifDepreciation: null,
    dateCreation: meta.now,
    dateModification: meta.now,
    creePar: meta.auteurId,
    modifiePar: meta.auteurId,
  }),
  mapUpdateInput: (existing, input, meta: EntityMeta) => ({
    ...existing,
    code: input.code ?? existing.code,
    libelle: LibelleBilingue.create(
      input.libelle ?? existing.libelle.fr,
      input.libelleEn ?? existing.libelle.en,
    ),
    libelleCourt: input.libelleCourt ?? existing.libelleCourt,
    domaine: input.domaine ?? existing.domaine,
    typeMatiere: input.typeMatiere ?? existing.typeMatiere,
    baremeParDefaut: input.baremeParDefaut ?? existing.baremeParDefaut,
    description: input.description ?? existing.description,
    dateModification: meta.now,
    modifiePar: meta.auteurId,
  }),
});

const matiereReferentielNiveauRepository = createInMemoryReferentielRepository<
  MatiereReferentielNiveau,
  CreateMatiereReferentielNiveauInput,
  UpdateMatiereReferentielNiveauInput,
  MatiereReferentielNiveauFilters
>({
  store: stores.matieresReferentielNiveau,
  uniqueKey: (props) =>
    `${props.matiereReferentielId}:${props.niveauId}:${props.serieId ?? "∅"}`,
  matchesFilters: (entity, filters) => {
    if (entity.niveauId !== filters.niveauId) return false;
    if (filters.serieId) {
      return entity.serieId === filters.serieId || entity.serieId === undefined;
    }
    return true;
  },
  fromProps: (id, props) => MatiereReferentielNiveau.create(props, id),
  validateCreate: (input) => {
    const matiere = stores.matieresReferentiel.find((m) => m.id === input.matiereReferentielId);
    const niveau = stores.niveaux.find((n) => n.id === input.niveauId);
    ReferentielValidationService.validerParentActif(matiere, "matière");
    ReferentielValidationService.validerParentActif(niveau, "niveau");
    if (!matiere || !niveau) return;
    const cycle = stores.cycles.find((c) => c.id === niveau.cycleId);
    if (!cycle) return;

    let serieApparitionPosition: { rangCycle: number; rangDansCycle: number } | undefined;
    let serieOrdreEnseignementId: string | undefined;
    if (input.serieId) {
      const serieRef = stores.series.find((s) => s.id === input.serieId);
      ReferentielValidationService.validerParentActif(serieRef, "série");
      if (serieRef) {
        const niveauApparition = stores.niveaux.find((n) => n.id === serieRef.niveauApparitionId);
        const filiereRef = stores.filieres.find((f) => f.id === serieRef.filiereId);
        if (niveauApparition) {
          serieApparitionPosition = positionNiveau(niveauApparition);
        }
        serieOrdreEnseignementId = filiereRef?.ordreEnseignementId;
      }
    }

    ReferentielValidationService.validerMatiereReferentielNiveau({
      matiereSousSystemeId: matiere.sousSystemeId,
      cycleSousSystemeId: cycle.sousSystemeId,
      niveauPosition: { rangCycle: cycle.rang, rangDansCycle: niveau.rangDansCycle },
      cycleOrdreEnseignementId: cycle.ordreEnseignementId,
      serieApparitionPosition,
      serieOrdreEnseignementId,
    });
  },
  mapCreateInput: (input, meta: EntityMeta) => ({
    matiereReferentielId: input.matiereReferentielId,
    niveauId: input.niveauId,
    serieId: input.serieId,
    estObligatoire: input.estObligatoire ?? true,
    coefficientSuggere: input.coefficientSuggere,
    sourceCoefficient: input.sourceCoefficient,
    baremeSpecifique: input.baremeSpecifique,
    description: input.description,
    etat: "ACTIVE" as const,
    dateEntreeVigueur: meta.now.slice(0, 10),
    dateDepreciation: null,
    motifDepreciation: null,
    dateCreation: meta.now,
    dateModification: meta.now,
    creePar: meta.auteurId,
    modifiePar: meta.auteurId,
  }),
  mapUpdateInput: (existing, input, meta: EntityMeta) => ({
    ...existing,
    estObligatoire: input.estObligatoire ?? existing.estObligatoire,
    coefficientSuggere: input.coefficientSuggere ?? existing.coefficientSuggere,
    sourceCoefficient: input.sourceCoefficient ?? existing.sourceCoefficient,
    baremeSpecifique: input.baremeSpecifique ?? existing.baremeSpecifique,
    description: input.description ?? existing.description,
    dateModification: meta.now,
    modifiePar: meta.auteurId,
  }),
});

// ---------------------------------------------------------------------------
// 3.7 — Audit (lecture seule)
// ---------------------------------------------------------------------------

const auditRepository = createMockAuditRepository(stores.audit);

// ---------------------------------------------------------------------------
// Composition root exposée au reste du module (hooks TanStack Query,
// éventuellement les futures pages).
// ---------------------------------------------------------------------------

function buildResourceContainer<TEntity, TCreateInput, TUpdateInput, TFilters extends import("~/modules/referentiel/domain/repositories/referentiel.repository").ReferentielFilters, TDto>(
  repository: import("~/modules/referentiel/domain/repositories/referentiel.repository").ReferentielRepository<TEntity, TCreateInput, TUpdateInput, TFilters>,
  toDto: (entity: TEntity) => TDto,
) {
  return {
    repository,
    listUseCase: new ListReferentielEntriesUseCase(repository, toDto),
    getByIdUseCase: new GetReferentielEntryByIdUseCase(repository, toDto),
    createUseCase: new CreateReferentielEntryUseCase(repository, toDto),
    updateUseCase: new UpdateReferentielEntryUseCase(repository, toDto),
    deprecierUseCase: new DeprecierReferentielEntryUseCase(repository, toDto),
  };
}

export const referentielContainer = {
  sousSystemes: buildResourceContainer(sousSystemeRepository, toSousSystemeDto),
  ordresEnseignement: buildResourceContainer(ordreEnseignementRepository, toOrdreEnseignementDto),
  typesEnseignement: buildResourceContainer(typeEnseignementRepository, toTypeEnseignementDto),
  cycles: buildResourceContainer(cycleRepository, toCycleDto),
  niveaux: buildResourceContainer(niveauRepository, toNiveauDto),
  filieres: buildResourceContainer(filiereRepository, toFiliereDto),
  series: buildResourceContainer(serieRepository, toSerieDto),
  matieresReferentiel: buildResourceContainer(matiereReferentielRepository, toMatiereReferentielDto),
  matieresReferentielNiveau: buildResourceContainer(
    matiereReferentielNiveauRepository,
    toMatiereReferentielNiveauDto,
  ),
  audit: {
    repository: auditRepository,
    listUseCase: new ListAuditEntriesUseCase(auditRepository),
  },
};
