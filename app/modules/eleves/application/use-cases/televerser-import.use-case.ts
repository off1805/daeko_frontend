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
  fichierRef: string; // référence de stockage, jamais le contenu brut
  classeCibleId?: string;
  creePar: string;
}

/**
 * POST /imports (dossier technique §5.4). Lit le fichier en streaming,
 * crée le lot ET toutes ses lignes brutes (statut VALIDE) — la
 * correspondance et la création des fiches viennent dans des étapes
 * séparées (voir fichiers suivants).
 */
export class TeleverserImportUseCase
  implements UseCase<TeleverserImportInputDto, ImportLotReadDto>
{
  constructor(
    private readonly importLotRepository: ImportLotRepository,
    private readonly importLigneRepository: ImportLigneRepository,
    private readonly parser: FichierImportParserPort,
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort
  ) {}

  async execute(input: TeleverserImportInputDto): Promise<ImportLotReadDto> {
    const entetes = await this.parser.detecterEntetes(input.fichierRef);

    const lotId = this.idGenerator.generer();
    let lot = ImportLot.televerser(lotId, {
      etablissementId: input.etablissementId,
      fichierNom: input.fichierNom,
      nbLignes: entetes.nombreLignesEstime,
      classeCibleId: input.classeCibleId,
      creePar: input.creePar,
      maintenant: this.clock.maintenant(),
    });

    // Écriture des lignes brutes par lot de 200, jamais tout le fichier chargé en mémoire d'un coup.
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
    return ImportMapper.lotVersDto(lot);
  }
}