import type { UseCase } from "~/shared/domain/use-case";
import type { ClockPort } from "~/shared/application/ports";
import type { EleveRepository } from "../../domain/repositories/eleve.repository";
import { EleveIntrouvableError } from "../../domain/errors/eleve.errors";
import { EleveMapper } from "../mappers/eleve.mapper";
import type { EleveReadDto } from "../dto/eleve-read.dto";

/** DELETE /tuteurs/{id} : refusé si dernier tuteur ou principal sans remplaçant (ELV-014). */
export class SupprimerTuteurUseCase
  implements UseCase<{ eleveId: string; etablissementId: string; tuteurId: string }, EleveReadDto>
{
  constructor(
    private readonly eleveRepository: EleveRepository,
    private readonly clock: ClockPort
  ) {}

  async execute(params: {
    eleveId: string;
    etablissementId: string;
    tuteurId: string;
  }): Promise<EleveReadDto> {
    const eleve = await this.eleveRepository.obtenirParId(
      params.eleveId,
      params.etablissementId
    );
    if (!eleve) throw new EleveIntrouvableError(params.eleveId);

    const eleveMisAJour = eleve.supprimerTuteur(
      params.tuteurId,
      this.clock.maintenant()
    );
    await this.eleveRepository.sauvegarder(eleveMisAJour);
    return EleveMapper.versReadDto(eleveMisAJour);
  }
}