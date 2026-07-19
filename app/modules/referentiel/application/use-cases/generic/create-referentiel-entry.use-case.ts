import type { UseCase } from "~/shared/domain/use-case";
import type {
  ReferentielFilters,
  ReferentielRepository,
} from "~/modules/referentiel/domain/repositories/referentiel.repository";

interface CreateInput<TCreateInput> {
  data: TCreateInput;
  auteurId: string;
}

export class CreateReferentielEntryUseCase<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TFilters extends ReferentielFilters,
  TDto,
> implements UseCase<CreateInput<TCreateInput>, TDto>
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

  async execute({ data, auteurId }: CreateInput<TCreateInput>): Promise<TDto> {
    const entity = await this.repository.create(data, auteurId);
    return this.toDto(entity);
  }
}
