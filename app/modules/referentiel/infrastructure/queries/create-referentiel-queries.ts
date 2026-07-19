import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  PaginationParams,
  ReferentielFilters,
} from "~/modules/referentiel/domain/repositories/referentiel.repository";
import type { ListReferentielEntriesUseCase } from "~/modules/referentiel/application/use-cases/generic/list-referentiel-entries.use-case";
import type { GetReferentielEntryByIdUseCase } from "~/modules/referentiel/application/use-cases/generic/get-referentiel-entry-by-id.use-case";
import type { CreateReferentielEntryUseCase } from "~/modules/referentiel/application/use-cases/generic/create-referentiel-entry.use-case";
import type { UpdateReferentielEntryUseCase } from "~/modules/referentiel/application/use-cases/generic/update-referentiel-entry.use-case";
import type { DeprecierReferentielEntryUseCase } from "~/modules/referentiel/application/use-cases/generic/deprecier-referentiel-entry.use-case";

interface ResourceUseCases<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TFilters extends ReferentielFilters,
  TDto,
> {
  listUseCase: ListReferentielEntriesUseCase<TEntity, TCreateInput, TUpdateInput, TFilters, TDto>;
  getByIdUseCase: GetReferentielEntryByIdUseCase<TEntity, TCreateInput, TUpdateInput, TFilters, TDto>;
  createUseCase: CreateReferentielEntryUseCase<TEntity, TCreateInput, TUpdateInput, TFilters, TDto>;
  updateUseCase: UpdateReferentielEntryUseCase<TEntity, TCreateInput, TUpdateInput, TFilters, TDto>;
  deprecierUseCase: DeprecierReferentielEntryUseCase<TEntity, TCreateInput, TUpdateInput, TFilters, TDto>;
}

/**
 * Fabrique de hooks TanStack Query pour une ressource du référentiel.
 * Toutes les ressources CRUD partagent la même forme (doc section 5) :
 * plutôt que d'écrire 9 fois les mêmes 5 hooks, on les dérive une seule
 * fois ici et on les instancie par ressource dans referentiel.queries.ts.
 */
export function createReferentielQueries<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TFilters extends ReferentielFilters,
  TDto,
>(
  resourceKey: string,
  useCases: ResourceUseCases<TEntity, TCreateInput, TUpdateInput, TFilters, TDto>,
) {
  function useList(filters: TFilters & PaginationParams) {
    return useQuery({
      queryKey: [resourceKey, "list", filters],
      queryFn: () => useCases.listUseCase.execute(filters),
    });
  }

  function useById(id: string | undefined) {
    return useQuery({
      queryKey: [resourceKey, "detail", id],
      queryFn: () => useCases.getByIdUseCase.execute({ id: id as string }),
      enabled: Boolean(id),
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (input: { data: TCreateInput; auteurId: string }) =>
        useCases.createUseCase.execute(input),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] });
      },
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (input: { id: string; data: TUpdateInput; auteurId: string }) =>
        useCases.updateUseCase.execute(input),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] });
      },
    });
  }

  function useDeprecier() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (input: {
        id: string;
        motif: string;
        auteurId: string;
        dateEffet?: string;
      }) => useCases.deprecierUseCase.execute(input),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [resourceKey] });
      },
    });
  }

  return { useList, useById, useCreate, useUpdate, useDeprecier };
}
