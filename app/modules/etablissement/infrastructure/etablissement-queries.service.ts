import type { EtablissementRepository } from '~/modules/etablissement/domain/repositories/etablissement.repository';
import type { EtablissementReadDto } from '~/modules/etablissement/application/dto/etablissement-read.dto';
import { EtablissementMapper } from '~/modules/etablissement/application/mappers/etablissement.mappers';

export class EtablissementQueries {
  constructor(private readonly etablissementRepo: EtablissementRepository) {}

  public async getDetailsById(id: string): Promise<EtablissementReadDto | null> {
    const etb = await this.etablissementRepo.findById(id);
    if (!etb) return null;

    const enTete = await this.etablissementRepo.findEnTeteByEtablissementId(id);
    const signataires = await this.etablissementRepo.findSignatairesByEtablissementId(id);

    return EtablissementMapper.toReadDto(etb, enTete || undefined, signataires);
  }
}