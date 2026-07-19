import type { UseCase } from "~/shared/domain/use-case";
import type {
  ReferentielFilters,
  ReferentielRepository,
} from "~/modules/referentiel/domain/repositories/referentiel.repository";

interface DeprecierInput {
  id: string;
  motif: string;
  auteurId: string;
  dateEffet?: string;
}

export class DeprecierReferentielEntryUseCase<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TFilters extends ReferentielFilters,
  TDto,
> implements UseCase<DeprecierInput, TDto>
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

  async execute({
    id,
    motif,
    auteurId,
    dateEffet,
  }: DeprecierInput): Promise<TDto> {
    const entity = await this.repository.deprecier(
      id,
      motif,
      auteurId,
      dateEffet,
    );
    return this.toDto(entity);
  }
}
