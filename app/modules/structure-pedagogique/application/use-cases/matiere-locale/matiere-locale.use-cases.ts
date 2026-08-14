import type { UseCase } from "~/shared/domain/use-case";
import type {
  CreateMatiereLocaleInput,
  MatiereLocaleRepository,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import type { MatiereLocaleDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto";
import { toMatiereLocaleDto } from "~/modules/structure-pedagogique/application/mappers/structure.mappers";

interface CreerMatiereLocaleInput {
  data: CreateMatiereLocaleInput;
  auteurId: string;
}

export class CreerMatiereLocaleUseCase
  implements UseCase<CreerMatiereLocaleInput, MatiereLocaleDto>
{
  constructor(private readonly repository: MatiereLocaleRepository) {}

  async execute({ data, auteurId }: CreerMatiereLocaleInput): Promise<MatiereLocaleDto> {
    return toMatiereLocaleDto(await this.repository.create(data, auteurId));
  }
}

interface ListerMatieresLocalesInput {
  brancheId: string;
  etat?: "ACTIVE" | "TOUS";
}

export class ListerMatieresLocalesUseCase
  implements UseCase<ListerMatieresLocalesInput, MatiereLocaleDto[]>
{
  constructor(private readonly repository: MatiereLocaleRepository) {}

  async execute({ brancheId, etat }: ListerMatieresLocalesInput): Promise<MatiereLocaleDto[]> {
    const entries = await this.repository.listByBranche(brancheId, { etat });
    return entries.map(toMatiereLocaleDto);
  }
}

interface DeprecierMatiereLocaleInput {
  id: string;
  motif: string;
  auteurId: string;
}

export class DeprecierMatiereLocaleUseCase
  implements UseCase<DeprecierMatiereLocaleInput, MatiereLocaleDto>
{
  constructor(private readonly repository: MatiereLocaleRepository) {}

  async execute({ id, motif, auteurId }: DeprecierMatiereLocaleInput): Promise<MatiereLocaleDto> {
    return toMatiereLocaleDto(await this.repository.deprecier(id, motif, auteurId));
  }
}
