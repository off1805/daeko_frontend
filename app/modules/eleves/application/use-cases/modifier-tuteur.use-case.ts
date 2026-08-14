import type { UseCase } from "~/shared/domain/use-case";
import type { ClockPort } from "~/shared/application/ports";
import type { EleveRepository } from "../../domain/repositories/eleve.repository";
import { EleveIntrouvableError } from "../../domain/errors/eleve.errors";
import { EleveMapper } from "../mappers/eleve.mapper";
import type { ModifierTuteurInputDto } from "../dto/eleve-write.dto";
import type { EleveReadDto } from "../dto/eleve-read.dto";

export interface ModifierTuteurUseCaseInput {
  eleveId: string;
  etablissementId: string;
  tuteurId: string;
  input: ModifierTuteurInputDto;
}

/** PATCH /tuteurs/{id}. */
export class ModifierTuteurUseCase
  implements UseCase<ModifierTuteurUseCaseInput, EleveReadDto>
{
  constructor(
    private readonly eleveRepository: EleveRepository,
    private readonly clock: ClockPort
  ) {}

  async execute(params: ModifierTuteurUseCaseInput): Promise<EleveReadDto> {
    const eleve = await this.eleveRepository.obtenirParId(
      params.eleveId,
      params.etablissementId
    );
    if (!eleve) throw new EleveIntrouvableError(params.eleveId);

    const eleveMisAJour = eleve.modifierTuteur(
      params.tuteurId,
      params.input,
      this.clock.maintenant()
    );
    await this.eleveRepository.sauvegarder(eleveMisAJour);
    return EleveMapper.versReadDto(eleveMisAJour);
  }
}