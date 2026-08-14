import type { UseCase } from "~/shared/domain/use-case";
import type {
  ConfigurationRepository,
  CreerConfigurationInput,
  RapportDuplication,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import type { ConfigurationBrancheAnneeDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto";
import { toConfigurationDto } from "~/modules/structure-pedagogique/application/mappers/structure.mappers";

interface CreerConfigurationUseCaseInput {
  data: CreerConfigurationInput;
  auteurId: string;
}

export interface CreerConfigurationUseCaseResult {
  configuration: ConfigurationBrancheAnneeDto;
  rapport: RapportDuplication | null;
}

/** Doc section 4.3 : porte l'algorithme de duplication d'une année sur l'autre (via le repository, seul à avoir accès aux stores et au référentiel). */
export class CreerConfigurationUseCase
  implements UseCase<CreerConfigurationUseCaseInput, CreerConfigurationUseCaseResult>
{
  constructor(private readonly repository: ConfigurationRepository) {}

  async execute({
    data,
    auteurId,
  }: CreerConfigurationUseCaseInput): Promise<CreerConfigurationUseCaseResult> {
    const result = await this.repository.creer(data, auteurId);
    return {
      configuration: toConfigurationDto(result.configuration),
      rapport: result.rapport,
    };
  }
}
