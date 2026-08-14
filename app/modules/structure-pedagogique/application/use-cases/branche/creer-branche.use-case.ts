import type { UseCase } from "~/shared/domain/use-case";
import type {
  BrancheRepository,
  CreateBrancheInput,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import type { BrancheDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto";
import { toBrancheDto } from "~/modules/structure-pedagogique/application/mappers/structure.mappers";

interface CreerBrancheInput {
  data: CreateBrancheInput;
  auteurId: string;
}

export class CreerBrancheUseCase implements UseCase<CreerBrancheInput, BrancheDto> {
  constructor(private readonly repository: BrancheRepository) {}

  async execute({ data, auteurId }: CreerBrancheInput): Promise<BrancheDto> {
    const branche = await this.repository.create(data, auteurId);
    return toBrancheDto(branche);
  }
}

export class ListerBranchesUseCase implements UseCase<void, BrancheDto[]> {
  constructor(private readonly repository: BrancheRepository) {}

  async execute(): Promise<BrancheDto[]> {
    const branches = await this.repository.list();
    return branches.map(toBrancheDto);
  }
}
