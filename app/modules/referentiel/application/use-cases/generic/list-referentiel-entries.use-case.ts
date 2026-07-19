import type { UseCase } from "~/shared/domain/use-case";
import type {
  PaginatedResult,
  PaginationParams,
  ReferentielFilters,
  ReferentielRepository,
} from "~/modules/referentiel/domain/repositories/referentiel.repository";

export class ListReferentielEntriesUseCase<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TFilters extends ReferentielFilters,
  TDto,
> implements UseCase<TFilters & PaginationParams, PaginatedResult<TDto>>
{
  constructor(
    private readonly repository: ReferentielRepository<
      TEntity,
      TCreateInput,
      TUpdateInput,
      TFilters
    >,
    private readonly toDto: (entity: TEntity) => TDto,
  ) {}

  async execute(
    filters: TFilters & PaginationParams,
  ): Promise<PaginatedResult<TDto>> {
    const result = await this.repository.list(filters);
    return { ...result, donnees: result.donnees.map(this.toDto) };
  }
}
