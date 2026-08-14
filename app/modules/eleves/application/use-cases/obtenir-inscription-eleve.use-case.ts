import type { UseCase } from "~/shared/domain/use-case";
import type { InscriptionRepository } from "../../domain/repositories/inscription.repository";
import { InscriptionMapper } from "../mappers/inscription.mapper";
import type { InscriptionReadDto } from "../dto/inscription-read.dto";

export interface ObtenirInscriptionEleveInputDto {
  eleveId: string;
  anneeAcademiqueId: string;
}

/** Utilisé par l'écran détail : sait afficher les bons boutons selon l'état réel de l'inscription. */
export class ObtenirInscriptionEleveUseCase
  implements UseCase<ObtenirInscriptionEleveInputDto, InscriptionReadDto | null>
{
  constructor(private readonly inscriptionRepository: InscriptionRepository) {}

  async execute(input: ObtenirInscriptionEleveInputDto): Promise<InscriptionReadDto | null> {
    const inscription = await this.inscriptionRepository.obtenirParEleveEtAnnee(
      input.eleveId,
      input.anneeAcademiqueId
    );
    return inscription ? InscriptionMapper.versReadDto(inscription) : null;
  }
}