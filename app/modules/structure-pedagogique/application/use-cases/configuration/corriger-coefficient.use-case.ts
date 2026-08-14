import type { UseCase } from "~/shared/domain/use-case";
import type { ConfigurationRepository } from "~/modules/structure-pedagogique/domain/repositories/structure.repository";
import type { MatiereActiveDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto";
import { toMatiereActiveDto } from "~/modules/structure-pedagogique/application/mappers/structure.mappers";

interface CorrigerCoefficientInput {
  matiereActiveId: string;
  nouveauCoefficient: number;
  motif: string;
  auteurId: string;
}

/**
 * Geste rare permanent de la vision UX (accès discret depuis l'état
 * stable du tableau de bord) : version v1 du flux de déverrouillage de
 * coefficient (doc POST /matieres-actives/{id}/deverrouiller-coefficient),
 * simplifiée tant que le verrouillage réel selon l'état de l'année
 * (matrice 4.6) n'est pas implémenté — voir le plan.
 */
export class CorrigerCoefficientUseCase
  implements UseCase<CorrigerCoefficientInput, MatiereActiveDto>
{
  constructor(private readonly repository: ConfigurationRepository) {}

  async execute({
    matiereActiveId,
    nouveauCoefficient,
    motif,
    auteurId,
  }: CorrigerCoefficientInput): Promise<MatiereActiveDto> {
    const matiereActive = await this.repository.corrigerCoefficient(
      matiereActiveId,
      { nouveauCoefficient, motif },
      auteurId,
    );
    return toMatiereActiveDto(matiereActive);
  }
}
