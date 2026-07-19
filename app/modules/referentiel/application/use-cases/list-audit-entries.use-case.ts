import type { UseCase } from "~/shared/domain/use-case";
import type {
  AuditFilters,
  AuditRepository,
  PaginatedResult,
  PaginationParams,
} from "~/modules/referentiel/domain/repositories/referentiel.repository";
import type { AuditEntryDto } from "~/modules/referentiel/application/dto/referentiel-read.dto";
import { toAuditEntryDto } from "~/modules/referentiel/application/mappers/referentiel.mappers";

export class ListAuditEntriesUseCase
  implements
    UseCase<AuditFilters & PaginationParams, PaginatedResult<AuditEntryDto>>
{
  constructor(private readonly repository: AuditRepository) {}

  async execute(
    filters: AuditFilters & PaginationParams,
  ): Promise<PaginatedResult<AuditEntryDto>> {
    const result = await this.repository.list(filters);
    return { ...result, donnees: result.donnees.map(toAuditEntryDto) };
  }
}
