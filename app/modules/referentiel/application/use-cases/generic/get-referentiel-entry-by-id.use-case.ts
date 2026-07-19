import type { UseCase } from "~/shared/domain/use-case";
import type {
  ReferentielFilters,
  ReferentielRepository,
} from "~/modules/referentiel/domain/repositories/referentiel.repository";
import { EntreeIntrouvableError } from "~/modules/referentiel/domain/errors/referentiel.errors";

interface GetByIdInput {
  id: string;
}

export class GetReferentielEntryByIdUseCase<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TFilters extends ReferentielFilters,
  TDto,
> implements UseCase<GetByIdInput, TDto>
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

  async execute({ id }: GetByIdInput): Promise<TDto> {
    const entity = await this.repository.getById(id);
    if (!entity) {
      throw new EntreeIntrouvableError(id);
    }
    return this.toDto(entity);
  }
}
