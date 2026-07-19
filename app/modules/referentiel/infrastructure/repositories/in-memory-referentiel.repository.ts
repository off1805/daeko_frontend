import type { ReferentielEntity } from "~/modules/referentiel/domain/shared/referentiel-entity";
import type {
  ReferentielFilters,
  ReferentielRepository,
} from "~/modules/referentiel/domain/repositories/referentiel.repository";
import {
  EntreeIntrouvableError,
  ViolationUniciteError,
} from "~/modules/referentiel/domain/errors/referentiel.errors";
import { ReferentielValidationService } from "~/modules/referentiel/domain/services/referentiel-validation.service";

export interface EntityMeta {
  id: string;
  auteurId: string;
  now: string;
}

/**
 * Les positions `any` ci-dessous sont internes au moteur générique : le
 * sac de props diffère par entité (VO, champs métier) et n'a pas besoin
 * d'être typé ici — le port PUBLIC exposé par
 * `createInMemoryReferentielRepository` (ReferentielRepository<TEntity,
 * TCreateInput, TUpdateInput, TFilters>) reste, lui, strictement typé.
 */
export interface InMemoryReferentielConfig<
  TEntity extends ReferentielEntity<object>,
  TCreateInput,
  TUpdateInput,
  TFilters extends ReferentielFilters,
> {
  /** Table simulée : tableau mutable, partagé avec le reste du container pour les jointures. */
  store: TEntity[];
  /** Reconstruit une instance de l'entité à partir d'un sac de props complet (création, mise à jour, dépréciation). */
  fromProps: (id: string, props: any) => TEntity;
  /** Convertit l'input de création en props complètes (y compris les valeurs de cycle de vie par défaut). */
  mapCreateInput: (input: TCreateInput, meta: EntityMeta) => any;
  /** Fusionne les props existantes avec l'input de mise à jour ; doit inclure dateModification/modifiePar. */
  mapUpdateInput: (
    existingProps: any,
    input: TUpdateInput,
    meta: EntityMeta,
  ) => any;
  matchesFilters: (entity: TEntity, filters: TFilters) => boolean;
  /** Clé composite représentant le périmètre d'unicité (REF-001), ex: `${sousSystemeId}:${code}`. */
  uniqueKey: (props: any) => string;
  /** REF-002/003/004/006/011 : validations croisées, résolues par des closures capturant les stores voisins. */
  validateCreate?: (input: TCreateInput) => void;
  validateUpdate?: (existingProps: any, input: TUpdateInput) => void;
}

function nowIso(): string {
  return new Date().toISOString();
}

export function createInMemoryReferentielRepository<
  TEntity extends ReferentielEntity<object>,
  TCreateInput,
  TUpdateInput,
  TFilters extends ReferentielFilters,
>(
  config: InMemoryReferentielConfig<
    TEntity,
    TCreateInput,
    TUpdateInput,
    TFilters
  >,
): ReferentielRepository<TEntity, TCreateInput, TUpdateInput, TFilters> {
  function ensureUnique(props: any, excludeId?: string): void {
    const key = config.uniqueKey(props);
    const collision = config.store.some(
      (entity) =>
        entity.id !== excludeId &&
        config.uniqueKey(entity.toProps()) === key,
    );
    if (collision) {
      throw new ViolationUniciteError("code", key);
    }
  }

  return {
    async list(filters) {
      const etatFiltre = filters.etat ?? "ACTIVE";
      const filtered = config.store.filter((entity) => {
        const etatOk = etatFiltre === "TOUS" || entity.etat === etatFiltre;
        return etatOk && config.matchesFilters(entity, filters);
      });
      const page = filters.page ?? 1;
      const taille = Math.min(filters.taille ?? 50, 200);
      const debut = (page - 1) * taille;
      return {
        donnees: filtered.slice(debut, debut + taille),
        page,
        taille,
        total: filtered.length,
      };
    },

    async getById(id) {
      return config.store.find((entity) => entity.id === id) ?? null;
    },

    async create(input, auteurId) {
      config.validateCreate?.(input);
      const now = nowIso();
      const id = crypto.randomUUID();
      const props = config.mapCreateInput(input, { id, auteurId, now });
      ensureUnique(props);
      const entity = config.fromProps(id, props);
      config.store.push(entity);
      return entity;
    },

    async update(id, input, auteurId) {
      const existing = config.store.find((entity) => entity.id === id);
      if (!existing) {
        throw new EntreeIntrouvableError(id);
      }
      const existingProps = existing.toProps();
      config.validateUpdate?.(existingProps, input);
      const now = nowIso();
      const props = config.mapUpdateInput(existingProps, input, {
        id,
        auteurId,
        now,
      });
      ensureUnique(props, id);
      const updated = config.fromProps(id, props);
      config.store[config.store.indexOf(existing)] = updated;
      return updated;
    },

    async deprecier(id, motif, auteurId, dateEffet) {
      const existing = config.store.find((entity) => entity.id === id);
      if (!existing) {
        throw new EntreeIntrouvableError(id);
      }
      if (existing.etat === "DEPRECATED") {
        // REF-012 : dépréciation déjà effective, opération sans effet.
        return existing;
      }
      ReferentielValidationService.validerMotifDepreciation(motif);
      const now = nowIso();
      const props = {
        ...existing.toProps(),
        etat: "DEPRECATED" as const,
        dateDepreciation: dateEffet ?? now.slice(0, 10),
        motifDepreciation: motif,
        dateModification: now,
        modifiePar: auteurId,
      };
      const updated = config.fromProps(id, props);
      config.store[config.store.indexOf(existing)] = updated;
      return updated;
    },
  };
}
