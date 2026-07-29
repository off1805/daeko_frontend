import type { UseCase } from "~/shared/domain/use-case";
import type { ImportLigneRepository } from "../../domain/repositories/import-ligne.repository";
import { ImportMapper } from "../mappers/import.mapper";
import type { ImportLigneReadDto } from "../dto/import-read.dto";

export interface ListerRejetsImportInputDto {
  lotId: string;
}

/** GET /imports/{id}/rejets — exportable en CSV côté infrastructure/présentation. */
export class ListerRejetsImportUseCase
  implements UseCase<ListerRejetsImportInputDto, ImportLigneReadDto[]>
{
  constructor(private readonly importLigneRepository: ImportLigneRepository) {}

  async execute(input: ListerRejetsImportInputDto): Promise<ImportLigneReadDto[]> {
    const lignesRejetees = await this.importLigneRepository.listerRejeteesParLot(
      input.lotId
    );
    return lignesRejetees.map(ImportMapper.ligneVersDto);
  }
}