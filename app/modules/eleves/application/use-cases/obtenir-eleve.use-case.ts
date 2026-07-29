import type { UseCase } from "~/shared/domain/use-case";
import type { EleveRepository } from "../../domain/repositories/eleve.repository";
import { EleveIntrouvableError } from "../../domain/errors/eleve.errors";
import { EleveMapper } from "../mappers/eleve.mapper";
import type { EleveReadDto } from "../dto/eleve-read.dto";

export interface ObtenirEleveInputDto {
  eleveId: string;
  etablissementId: string;
}

/** GET /eleves/{id} (dossier technique §5.1). */
export class ObtenirEleveUseCase
  implements UseCase<ObtenirEleveInputDto, EleveReadDto>
{
  constructor(private readonly eleveRepository: EleveRepository) {}

  async execute(input: ObtenirEleveInputDto): Promise<EleveReadDto> {
    const eleve = await this.eleveRepository.obtenirParId(
      input.eleveId,
      input.etablissementId
    );
    if (!eleve) throw new EleveIntrouvableError(input.eleveId);
    return EleveMapper.versReadDto(eleve);
  }
}