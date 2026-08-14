import type { UseCase } from "~/shared/domain/use-case";
import type {
  InscriptionRepository,
  FiltresInscriptionsParClasse,
} from "../../domain/repositories/inscription.repository";
import { InscriptionMapper } from "../mappers/inscription.mapper";
import type { InscriptionResumeReadDto } from "../dto/inscription-read.dto";

export interface PageResultatDto<T> {
  items: T[];
  total: number;
  page: number;
  taille: number;
}

/** GET /classes/{classeId}/inscriptions (dossier technique §5.3, §8). */
export class ListerInscriptionsClasseUseCase
  implements UseCase<FiltresInscriptionsParClasse, PageResultatDto<InscriptionResumeReadDto>>
{
  constructor(private readonly inscriptionRepository: InscriptionRepository) {}

  async execute(
    filtres: FiltresInscriptionsParClasse
  ): Promise<PageResultatDto<InscriptionResumeReadDto>> {
    const resultat = await this.inscriptionRepository.listerParClasse(filtres);

    return {
      items: resultat.items.map(InscriptionMapper.versResumeDto),
      total: resultat.total,
      page: resultat.page,
      taille: resultat.taille,
    };
  }
}