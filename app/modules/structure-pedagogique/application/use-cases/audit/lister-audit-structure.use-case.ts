import type { UseCase } from "~/shared/domain/use-case";
import type {
  AuditStructureFilters,
  AuditStructureRepository,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import type { AuditStructureDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto";
import { toAuditStructureDto } from "~/modules/structure-pedagogique/application/mappers/structure.mappers";

/** Alimente l'écran Historique (nav globale, entrée secondaire discrète). */
export class ListerAuditStructureUseCase
  implements UseCase<AuditStructureFilters | undefined, AuditStructureDto[]>
{
  constructor(private readonly repository: AuditStructureRepository) {}

  async execute(filters?: AuditStructureFilters): Promise<AuditStructureDto[]> {
    const entries = await this.repository.list(filters);
    return entries
      .slice()
      .sort((a, b) => b.horodatage.localeCompare(a.horodatage))
      .map(toAuditStructureDto);
  }
}
