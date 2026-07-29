import { Inscription } from "../../domain/entities/inscription.entity";
import { MutationInscription } from "../../domain/entities/mutation-inscription.entity";
import type {
  InscriptionReadDto,
  InscriptionResumeReadDto,
  MutationReadDto,
} from "../dto/inscription-read.dto";

export class InscriptionMapper {
  static versMutationDto(mutation: MutationInscription): MutationReadDto {
    return {
      id: mutation.id,
      classeOrigineId: mutation.classeOrigineId,
      classeArriveeId: mutation.classeArriveeId,
      numeroOrdreOrigine: mutation.numeroOrdreOrigine,
      numeroOrdreArrivee: mutation.numeroOrdreArrivee,
      dateMutation: mutation.dateMutation,
      motif: mutation.motif,
      acteurId: mutation.acteurId,
    };
  }

  static versReadDto(inscription: Inscription): InscriptionReadDto {
    return {
      id: inscription.id,
      etablissementId: inscription.etablissementId,
      eleveId: inscription.eleveId,
      classeId: inscription.classeId,
      anneeAcademiqueId: inscription.anneeAcademiqueId,
      numeroOrdre: inscription.numeroOrdre,
      etat: inscription.etat,
      dateInscription: inscription.dateInscription,
      dateCloture: inscription.dateCloture ?? undefined,
      motifCloture: inscription.motifCloture ?? undefined,
      mutations: inscription.mutations.map(InscriptionMapper.versMutationDto),
    };
  }

  static versResumeDto(inscription: Inscription): InscriptionResumeReadDto {
    return {
      id: inscription.id,
      eleveId: inscription.eleveId,
      numeroOrdre: inscription.numeroOrdre,
      etat: inscription.etat,
    };
  }
}