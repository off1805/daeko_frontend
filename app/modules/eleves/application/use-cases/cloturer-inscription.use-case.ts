import type { UseCase } from "~/shared/domain/use-case";
import type { ClockPort } from "~/shared/application/ports";
import type { InscriptionRepository } from "../../domain/repositories/inscription.repository";
import { InscriptionIntrouvableError } from "../../domain/errors/inscription.errors";
import { InscriptionMapper } from "../mappers/inscription.mapper";
import type { InscriptionReadDto } from "../dto/inscription-read.dto";

export interface CloturerInscriptionInputDto {
  inscriptionId: string;
  type: "ABANDON" | "EXCLUSION";
  motif: string;
}

/** CU-05 : départ/abandon ou exclusion définitive (RM-E-09, ELV-013). */
export class CloturerInscriptionUseCase
  implements UseCase<CloturerInscriptionInputDto, InscriptionReadDto>
{
  constructor(
    private readonly inscriptionRepository: InscriptionRepository,
    private readonly clock: ClockPort
  ) {}

  async execute(input: CloturerInscriptionInputDto): Promise<InscriptionReadDto> {
    const inscription = await this.inscriptionRepository.obtenirParId(input.inscriptionId);
    if (!inscription) throw new InscriptionIntrouvableError(input.inscriptionId);

    const inscriptionCloturee = inscription.cloturer(
      input.type,
      input.motif,
      this.clock.maintenant()
    );

    await this.inscriptionRepository.sauvegarder(inscriptionCloturee);
    return InscriptionMapper.versReadDto(inscriptionCloturee);
  }
}