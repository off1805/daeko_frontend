import type { UseCase } from "~/shared/domain/use-case";
import type { IdGeneratorPort, ClockPort } from "~/shared/application/ports";
import { ImportLot } from "../../domain/entities/import-lot.entity";
import { ImportLigne } from "../../domain/entities/import-ligne.entity";
import type { ImportLotRepository } from "../../domain/repositories/import-lot.repository";
import type { ImportLigneRepository } from "../../domain/repositories/import-ligne.repository";
import type { FichierImportParserPort } from "../ports/fichier-import-parser.port";
import { ImportMapper } from "../mappers/import.mapper";
import type { ImportLotReadDto } from "../dto/import-read.dto";

export interface TeleverserImportInputDto {
  etablissementId: string;
  fichierNom: string;
  fichierRef: string;
  classeCibleId?: string;
  creePar: string;
}

/** Sortie enrichie : les colonnes détectées sont nécessaires à l'écran de correspondance (étape suivante). */
export interface TeleverserImportResultDto {
  lot: ImportLotReadDto;
  colonnesDetectees: string[];
}

export class TeleverserImportUseCase
  implements UseCase<TeleverserImportInputDto, TeleverserImportResultDto>
{
  constructor(
    private readonly importLotRepository: ImportLotRepository,
    private readonly importLigneRepository: ImportLigneRepository,
    private readonly parser: FichierImportParserPort,
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort
  ) {}

  async execute(input: TeleverserImportInputDto): Promise<TeleverserImportResultDto> {
    const entetes = await this.parser.detecterEntetes(input.fichierRef);

    const lotId = this.idGenerator.generer();
    const lot = ImportLot.televerser(lotId, {
      etablissementId: input.etablissementId,
      fichierNom: input.fichierNom,
      nbLignes: entetes.nombreLignesEstime,
      classeCibleId: input.classeCibleId,
      creePar: input.creePar,
      maintenant: this.clock.maintenant(),
    });

    let tampon: ImportLigne[] = [];
    for await (const ligneBrute of this.parser.lireLignesBrutes(input.fichierRef)) {
      tampon.push(
        ImportLigne.create(this.idGenerator.generer(), {
          lotId,
          numeroLigne: ligneBrute.numeroLigne,
          donneesBrutes: ligneBrute.donneesBrutes,
        })
      );
      if (tampon.length >= 200) {
        await this.importLigneRepository.creerLot(tampon);
        tampon = [];
      }
    }
    if (tampon.length > 0) {
      await this.importLigneRepository.creerLot(tampon);
    }

    await this.importLotRepository.sauvegarder(lot);
    return { lot: ImportMapper.lotVersDto(lot), colonnesDetectees: entetes.colonnes };
  }
}