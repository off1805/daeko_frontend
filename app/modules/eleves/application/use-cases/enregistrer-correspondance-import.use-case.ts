import type { UseCase } from "~/shared/domain/use-case";
import type { ImportLotRepository } from "../../domain/repositories/import-lot.repository";
import { ImportMapper } from "../mappers/import.mapper";
import type { ImportLotReadDto } from "../dto/import-read.dto";

export interface EnregistrerCorrespondanceInputDto {
  lotId: string;
  etablissementId: string;
  correspondance: Record<string, string>; // colonne fichier -> champ plateforme
}

/** PUT /imports/{id}/correspondance : ELV-011 si champs obligatoires non couverts. */
export class EnregistrerCorrespondanceImportUseCase
  implements UseCase<EnregistrerCorrespondanceInputDto, ImportLotReadDto>
{
  constructor(private readonly importLotRepository: ImportLotRepository) {}

  async execute(input: EnregistrerCorrespondanceInputDto): Promise<ImportLotReadDto> {
    const lot = await this.importLotRepository.obtenirParId(
      input.lotId,
      input.etablissementId
    );
    if (!lot) throw new Error("Lot d'import introuvable.");

    // ELV-011 levée directement par le domaine si incomplet.
    const lotMisAJour = lot.enregistrerCorrespondance(input.correspondance);

    await this.importLotRepository.sauvegarder(lotMisAJour);
    return ImportMapper.lotVersDto(lotMisAJour);
  }
}