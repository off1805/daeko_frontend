import type { UseCase } from "~/shared/domain/use-case";
import type {
  AnneeAcademiqueRepository,
  BrancheRepository,
  ConfigurationRepository,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import type {
  BrancheTableauDeBordDto,
  ModeTableauDeBord,
  TableauDeBordDto,
} from "~/modules/structure-pedagogique/application/dto/structure-read.dto";
import {
  toAnneeAcademiqueDto,
  toBrancheDto,
  toConfigurationDto,
} from "~/modules/structure-pedagogique/application/mappers/structure.mappers";

/**
 * Calcule ce que l'écran "Ma structure" doit montrer (vision UX : un seul
 * écran, deux états pilotés par la fréquence réelle) — cette décision vit
 * ici plutôt que dans la présentation pour que le composant reste
 * déclaratif : ONBOARDING (aucune branche), RENTREE (la dernière année
 * créée est encore EN_PREPARATION), STABLE sinon.
 */
export class ObtenirTableauDeBordUseCase implements UseCase<void, TableauDeBordDto> {
  constructor(
    private readonly brancheRepository: BrancheRepository,
    private readonly anneeRepository: AnneeAcademiqueRepository,
    private readonly configurationRepository: ConfigurationRepository,
  ) {}

  async execute(): Promise<TableauDeBordDto> {
    const [branches, annees] = await Promise.all([
      this.brancheRepository.list(),
      this.anneeRepository.list(),
    ]);

    if (branches.length === 0) {
      return { mode: "ONBOARDING", anneeCourante: null, anneePrecedente: null, branches: [] };
    }

    const anneesTriees = [...annees].sort((a, b) =>
      b.dateDebut.localeCompare(a.dateDebut),
    );
    const anneeCourante = anneesTriees[0] ?? null;
    const anneePrecedente = anneesTriees[1] ?? null;

    const mode: ModeTableauDeBord = !anneeCourante
      ? "ONBOARDING"
      : anneeCourante.etat === "EN_PREPARATION"
        ? "RENTREE"
        : "STABLE";

    const branchesDto: BrancheTableauDeBordDto[] = await Promise.all(
      branches.map(async (branche) => {
        const [configuration, configurationPrecedente] = await Promise.all([
          anneeCourante
            ? this.configurationRepository.getByBrancheEtAnnee(branche.id, anneeCourante.id)
            : Promise.resolve(null),
          anneePrecedente
            ? this.configurationRepository.getByBrancheEtAnnee(branche.id, anneePrecedente.id)
            : Promise.resolve(null),
        ]);

        const detail = configuration
          ? await this.configurationRepository.getDetail(configuration.id)
          : null;

        return {
          branche: toBrancheDto(branche),
          configuration: configuration ? toConfigurationDto(configuration) : null,
          aUneConfigurationAnneePrecedente: Boolean(configurationPrecedente),
          progression: detail
            ? {
                filieresActivees: detail.filieresActives.length,
                niveauxActives: detail.niveauxActifs.length,
                seriesActives: detail.seriesActives.length,
                matieresActives: detail.matieresActives.length,
                classesCreees: detail.classes.length,
              }
            : null,
        };
      }),
    );

    return {
      mode,
      anneeCourante: anneeCourante ? toAnneeAcademiqueDto(anneeCourante) : null,
      anneePrecedente: anneePrecedente ? toAnneeAcademiqueDto(anneePrecedente) : null,
      branches: branchesDto,
    };
  }
}
