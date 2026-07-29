import type { UseCase } from "~/shared/domain/use-case";
import type {
  EleveRepository,
  FiltresEleves,
} from "../../domain/repositories/eleve.repository";
import { EleveMapper } from "../mappers/eleve.mapper";
import type { EleveResumeReadDto } from "../dto/eleve-read.dto";

export interface PageResultatDto<T> {
  items: T[];
  total: number;
  page: number;
  taille: number;
}


export class ListerElevesUseCase
  implements UseCase<FiltresEleves, PageResultatDto<EleveResumeReadDto>>
{
  constructor(private readonly eleveRepository: EleveRepository) {}

  async execute(filtres: FiltresEleves): Promise<PageResultatDto<EleveResumeReadDto>> {
    const resultat = await this.eleveRepository.lister(filtres);

    return {
      items: resultat.items.map(EleveMapper.versResumeDto),
      total: resultat.total,
      page: resultat.page,
      taille: resultat.taille,
    };
  }
}