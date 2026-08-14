import type { UseCase } from "~/shared/domain/use-case";
import type { ConfigurationRepository } from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import type { ConfigurationDetailDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto";
import {
  toClasseDto,
  toConfigurationDto,
  toFiliereActiveDto,
  toMatiereActiveDto,
  toNiveauActiveDto,
  toSerieActiveDto,
} from "~/modules/structure-pedagogique/application/mappers/structure.mappers";

/** Doc GET /configurations/{id} : "l'appel unique qui alimente l'écran de configuration" — et ici aussi la Matrice et les Classes. */
export class ObtenirConfigurationDetailUseCase
  implements UseCase<string, ConfigurationDetailDto | null>
{
  constructor(private readonly repository: ConfigurationRepository) {}

  async execute(id: string): Promise<ConfigurationDetailDto | null> {
    const detail = await this.repository.getDetail(id);
    if (!detail) return null;
    return {
      configuration: toConfigurationDto(detail.configuration),
      filieresActives: detail.filieresActives.map(toFiliereActiveDto),
      niveauxActifs: detail.niveauxActifs.map(toNiveauActiveDto),
      seriesActives: detail.seriesActives.map(toSerieActiveDto),
      matieresActives: detail.matieresActives.map(toMatiereActiveDto),
      classes: detail.classes.map(toClasseDto),
    };
  }
}

interface GetByBrancheEtAnneeInput {
  brancheId: string;
  anneeAcademiqueId: string;
}

export class ObtenirConfigurationParBrancheEtAnneeUseCase
  implements UseCase<GetByBrancheEtAnneeInput, ConfigurationDetailDto | null>
{
  constructor(
    private readonly repository: ConfigurationRepository,
    private readonly detailUseCase: ObtenirConfigurationDetailUseCase,
  ) {}

  async execute({
    brancheId,
    anneeAcademiqueId,
  }: GetByBrancheEtAnneeInput): Promise<ConfigurationDetailDto | null> {
    const configuration = await this.repository.getByBrancheEtAnnee(
      brancheId,
      anneeAcademiqueId,
    );
    if (!configuration) return null;
    return this.detailUseCase.execute(configuration.id);
  }
}
