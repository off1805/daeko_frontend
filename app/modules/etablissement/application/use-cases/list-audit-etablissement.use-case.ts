import type { EtablissementRepository } from '~/modules/etablissement/domain/repositories/etablissement.repository';
import type { AuditEtablissementDto } from '~/modules/etablissement/application/dto/etablissement-read.dto';
import { EtablissementMapper } from '~/modules/etablissement/application/mappers/etablissement.mappers';
import { EtablissementValidationError } from '~/modules/etablissement/domain/errors/etablissement.errors';

export class ListAuditEtablissementUseCase {
  constructor(private readonly etablissementRepo: EtablissementRepository) {}

  public async execute(etablissementId: string): Promise<AuditEtablissementDto[]> {
    const etablissement = await this.etablissementRepo.findById(etablissementId);
    if (!etablissement) {
      throw new EtablissementValidationError(`Établissement introuvable (ID: ${etablissementId}).`);
    }

    const auditEntries = await this.etablissementRepo.findAuditEntriesByEtablissementId(etablissementId);
    
    // Tri chronologique inverse (plus récent au plus ancien)
    const sortedEntries = auditEntries.sort((a, b) => b.date.getTime() - a.date.getTime());

    return sortedEntries.map((entry) => EtablissementMapper.toAuditDto(entry));
  }
}