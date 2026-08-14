import type { UseCase } from "~/shared/domain/use-case";
import type { BrancheRepository } from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import type { BrancheDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto";
import { toBrancheDto } from "~/modules/structure-pedagogique/application/mappers/structure.mappers";

interface IdAndAuteur {
  id: string;
  auteurId: string;
}

interface ModifierLibelleInput extends IdAndAuteur {
  libelle: string;
}

interface ArchiverInput extends IdAndAuteur {
  motif: string;
}

export class ModifierLibelleBrancheUseCase
  implements UseCase<ModifierLibelleInput, BrancheDto>
{
  constructor(private readonly repository: BrancheRepository) {}

  async execute({ id, libelle, auteurId }: ModifierLibelleInput): Promise<BrancheDto> {
    return toBrancheDto(await this.repository.modifierLibelle(id, libelle, auteurId));
  }
}

export class ActiverBrancheUseCase implements UseCase<IdAndAuteur, BrancheDto> {
  constructor(private readonly repository: BrancheRepository) {}

  async execute({ id, auteurId }: IdAndAuteur): Promise<BrancheDto> {
    return toBrancheDto(await this.repository.activer(id, auteurId));
  }
}

export class SuspendreBrancheUseCase implements UseCase<IdAndAuteur, BrancheDto> {
  constructor(private readonly repository: BrancheRepository) {}

  async execute({ id, auteurId }: IdAndAuteur): Promise<BrancheDto> {
    return toBrancheDto(await this.repository.suspendre(id, auteurId));
  }
}

export class ReactiverBrancheUseCase implements UseCase<IdAndAuteur, BrancheDto> {
  constructor(private readonly repository: BrancheRepository) {}

  async execute({ id, auteurId }: IdAndAuteur): Promise<BrancheDto> {
    return toBrancheDto(await this.repository.reactiver(id, auteurId));
  }
}

export class ArchiverBrancheUseCase implements UseCase<ArchiverInput, BrancheDto> {
  constructor(private readonly repository: BrancheRepository) {}

  async execute({ id, motif, auteurId }: ArchiverInput): Promise<BrancheDto> {
    return toBrancheDto(await this.repository.archiver(id, motif, auteurId));
  }
}
