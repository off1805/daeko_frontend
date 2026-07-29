import type { UseCase } from "~/shared/domain/use-case";
import type { ClockPort } from "~/shared/application/ports";
import type { EleveRepository } from "../../domain/repositories/eleve.repository";
import type { InscriptionRepository } from "../../domain/repositories/inscription.repository";
import { EleveIntrouvableError } from "../../domain/errors/eleve.errors";
import { EleveAvecInscriptionError } from "../../domain/errors/eleve.errors";
import { EleveMapper } from "../mappers/eleve.mapper";
import type { EleveReadDto } from "../dto/eleve-read.dto";

export interface ArchiverEleveInputDto {
  eleveId: string;
  etablissementId: string;
  anneeAcademiqueEnCoursId: string;
}


export class ArchiverEleveUseCase
  implements UseCase<ArchiverEleveInputDto, EleveReadDto>
{
  constructor(
    private readonly eleveRepository: EleveRepository,
    private readonly inscriptionRepository: InscriptionRepository,
    private readonly clock: ClockPort
  ) {}

  async execute(input: ArchiverEleveInputDto): Promise<EleveReadDto> {
    const eleve = await this.eleveRepository.obtenirParId(
      input.eleveId,
      input.etablissementId
    );
    if (!eleve) {
      throw new EleveIntrouvableError(input.eleveId);
    }

    // Vérification inter-agrégats : le domaine Eleve ne peut pas la faire lui-même.
    const inscriptionActive = await this.inscriptionRepository.obtenirInscriptionActive(
      input.eleveId,
      input.anneeAcademiqueEnCoursId
    );
    if (inscriptionActive) {
      throw new EleveAvecInscriptionError();
    }

    const maintenant = this.clock.maintenant();
    const eleveArchive = eleve.archiver(maintenant);

    await this.eleveRepository.sauvegarder(eleveArchive);
    return EleveMapper.versReadDto(eleveArchive);
  }
}