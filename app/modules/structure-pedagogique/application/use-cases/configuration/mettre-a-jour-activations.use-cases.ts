import type { UseCase } from "~/shared/domain/use-case";
import type {
  ConfigurationRepository,
  MatiereActiveInput,
  ResultatDifferentiel,
} from "~/modules/structure-pedagogique/domain/repositories/structure.repository";

interface MettreAJourFilieresInput {
  configurationId: string;
  filiereIds: string[];
  auteurId: string;
}

/** Doc "Écritures en masse" : PUT idempotent, état cible complet, différentiel calculé côté repository. */
export class MettreAJourFilieresActivesUseCase
  implements UseCase<MettreAJourFilieresInput, ResultatDifferentiel>
{
  constructor(private readonly repository: ConfigurationRepository) {}

  async execute({
    configurationId,
    filiereIds,
    auteurId,
  }: MettreAJourFilieresInput): Promise<ResultatDifferentiel> {
    return this.repository.mettreAJourFilieres(configurationId, filiereIds, auteurId);
  }
}

interface MettreAJourNiveauxInput {
  configurationId: string;
  niveauIds: string[];
  auteurId: string;
}

export class MettreAJourNiveauxActifsUseCase
  implements UseCase<MettreAJourNiveauxInput, ResultatDifferentiel>
{
  constructor(private readonly repository: ConfigurationRepository) {}

  async execute({
    configurationId,
    niveauIds,
    auteurId,
  }: MettreAJourNiveauxInput): Promise<ResultatDifferentiel> {
    return this.repository.mettreAJourNiveaux(configurationId, niveauIds, auteurId);
  }
}

interface MettreAJourSeriesInput {
  niveauActiveId: string;
  serieIds: string[];
  auteurId: string;
}

export class MettreAJourSeriesActivesUseCase
  implements UseCase<MettreAJourSeriesInput, ResultatDifferentiel>
{
  constructor(private readonly repository: ConfigurationRepository) {}

  async execute({
    niveauActiveId,
    serieIds,
    auteurId,
  }: MettreAJourSeriesInput): Promise<ResultatDifferentiel> {
    return this.repository.mettreAJourSeries(niveauActiveId, serieIds, auteurId);
  }
}

interface MettreAJourMatieresInput {
  niveauActiveId: string;
  matieres: MatiereActiveInput[];
  auteurId: string;
}

export class MettreAJourMatieresActivesUseCase
  implements UseCase<MettreAJourMatieresInput, ResultatDifferentiel>
{
  constructor(private readonly repository: ConfigurationRepository) {}

  async execute({
    niveauActiveId,
    matieres,
    auteurId,
  }: MettreAJourMatieresInput): Promise<ResultatDifferentiel> {
    return this.repository.mettreAJourMatieres(niveauActiveId, matieres, auteurId);
  }
}
