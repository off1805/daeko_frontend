import type { UseCase } from "~/shared/domain/use-case";
import type {
  ReferentielFilters,
  ReferentielRepository,
} from "~/modules/referentiel/domain/repositories/referentiel.repository";

interface UpdateInput<TUpdateInput> {
  id: string;
  data: TUpdateInput;
  auteurId: string;
}

export class UpdateReferentielEntryUseCase<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TFilters extends ReferentielFilters,
  TDto,
> implements UseCase<UpdateInput<TUpdateInput>, TDto>
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
    data,
    auteurId,
  }: UpdateInput<TUpdateInput>): Promise<TDto> {
    const entity = await this.repository.update(id, data, auteurId);
    return this.toDto(entity);
  }
}
