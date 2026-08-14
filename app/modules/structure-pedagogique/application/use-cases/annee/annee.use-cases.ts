import type { UseCase } from "~/shared/domain/use-case";
import type {
  AnneeAcademiqueRepository,
  CreateAnneeAcademiqueInput,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import type { AnneeAcademiqueDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto";
import { toAnneeAcademiqueDto } from "~/modules/structure-pedagogique/application/mappers/structure.mappers";

interface CreerAnneeInput {
  data: CreateAnneeAcademiqueInput;
  auteurId: string;
}

export class CreerAnneeAcademiqueUseCase
  implements UseCase<CreerAnneeInput, AnneeAcademiqueDto>
{
  constructor(private readonly repository: AnneeAcademiqueRepository) {}

  async execute({ data, auteurId }: CreerAnneeInput): Promise<AnneeAcademiqueDto> {
    return toAnneeAcademiqueDto(await this.repository.create(data, auteurId));
  }
}

export class ListerAnneesAcademiquesUseCase
  implements UseCase<void, AnneeAcademiqueDto[]>
{
  constructor(private readonly repository: AnneeAcademiqueRepository) {}

  async execute(): Promise<AnneeAcademiqueDto[]> {
    const annees = await this.repository.list();
    return annees.map(toAnneeAcademiqueDto);
  }
}

interface IdAndAuteur {
  id: string;
  auteurId: string;
}

export class DemarrerAnneeAcademiqueUseCase
  implements UseCase<IdAndAuteur, AnneeAcademiqueDto>
{
  constructor(private readonly repository: AnneeAcademiqueRepository) {}

  async execute({ id, auteurId }: IdAndAuteur): Promise<AnneeAcademiqueDto> {
    return toAnneeAcademiqueDto(await this.repository.demarrer(id, auteurId));
  }
}

interface CloturerAnneeInput {
  id: string;
  confirmation: string;
  auteurId: string;
}

/** Irréversible : scelle en cascade toutes les configurations de l'année (doc 4.4). */
export class CloturerAnneeAcademiqueUseCase
  implements UseCase<CloturerAnneeInput, AnneeAcademiqueDto>
{
  constructor(private readonly repository: AnneeAcademiqueRepository) {}

  async execute({ id, confirmation, auteurId }: CloturerAnneeInput): Promise<AnneeAcademiqueDto> {
    return toAnneeAcademiqueDto(await this.repository.cloturer(id, confirmation, auteurId));
  }
}
