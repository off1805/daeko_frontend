import { ImportLot } from "../../domain/entities/import-lot.entity";
import { ImportLigne } from "../../domain/entities/import-ligne.entity";
import type { ImportLotReadDto, ImportLigneReadDto } from "../dto/import-read.dto";

export class ImportMapper {
  static lotVersDto(lot: ImportLot): ImportLotReadDto {
    return {
      id: lot.id,
      etablissementId: lot.etablissementId,
      fichierNom: lot.fichierNom,
      statut: lot.statut,
      correspondanceColonnes: { ...lot.correspondanceColonnes },
      classeCibleId: lot.classeCibleId,
      nbLignes: lot.nbLignes,
      nbCreees: lot.nbCreees,
      nbRejetees: lot.nbRejetees,
      progression: lot.progression,
    };
  }

  static ligneVersDto(ligne: ImportLigne): ImportLigneReadDto {
    return {
      id: ligne.id,
      numeroLigne: ligne.numeroLigne,
      donneesBrutes: { ...ligne.donneesBrutes },
      statut: ligne.statut,
      codeRejet: ligne.codeRejet,
      messageRejet: ligne.messageRejet,
      eleveId: ligne.eleveId,
    };
  }
}