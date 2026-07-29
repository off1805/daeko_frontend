import type { UseCase } from "~/shared/domain/use-case";
import type { IdGeneratorPort, ClockPort } from "~/shared/application/ports";
import { Inscription } from "../../domain/entities/inscription.entity";
import type { InscriptionRepository } from "../../domain/repositories/inscription.repository";
import type { EleveRepository } from "../../domain/repositories/eleve.repository";
import type { StructurePedagogiqueQueryPort } from "../ports/structure-pedagogique-query.port";
import { NumeroOrdreService } from "../../domain/services/numero-ordre.service";
import {
  ClasseIndisponibleError,
  InscriptionActiveExistanteError,
  AnneeClotureeError,
} from "../../domain/errors/inscription.errors";
import { EleveIntrouvableError } from "../../domain/errors/eleve.errors";
import { InscriptionMapper } from "../mappers/inscription.mapper";
import type { InscriptionReadDto } from "../dto/inscription-read.dto";

export interface InscrireEleveInputDto {
  etablissementId: string;
  eleveId: string;
  classeId: string;
}


export class InscrireEleveUseCase
  implements UseCase<InscrireEleveInputDto, InscriptionReadDto>
{
  constructor(
    private readonly inscriptionRepository: InscriptionRepository,
    private readonly eleveRepository: EleveRepository,
    private readonly structurePedagogique: StructurePedagogiqueQueryPort,
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort
  ) {}

  async execute(input: InscrireEleveInputDto): Promise<InscriptionReadDto> {
    const eleve = await this.eleveRepository.obtenirParId(
      input.eleveId,
      input.etablissementId
    );
    if (!eleve) throw new EleveIntrouvableError(input.eleveId);

    // ELV-004 : classe existante et active.
    const classe = await this.structurePedagogique.obtenirClasse(input.classeId);
    if (!classe || !classe.estActive) {
      throw new ClasseIndisponibleError();
    }

    // ELV-003 : pas déjà d'inscription active cette année.
    const inscriptionExistante = await this.inscriptionRepository.obtenirInscriptionActive(
      input.eleveId,
      classe.anneeAcademiqueId
    );
    if (inscriptionExistante) {
      throw new InscriptionActiveExistanteError(
        inscriptionExistante.classeId,
        inscriptionExistante.id
      );
    }

    // ELV-005 : l'année ne doit pas être clôturée.
    const etatAnnee = await this.structurePedagogique.obtenirEtatAnnee(
      classe.anneeAcademiqueId
    );
    if (!etatAnnee) throw new ClasseIndisponibleError();
    if (etatAnnee === "CLOTUREE") {
      throw new AnneeClotureeError(classe.anneeAcademiqueId);
    }

    // RM-E-07 : calcul du numéro d'ordre (et, si EN_PREPARATION, des renumérotations à appliquer).
    const inscriptionsExistantes = await this.inscriptionRepository.listerActivesPourNumerotation(
      input.classeId
    );
    const resultat = NumeroOrdreService.attribuer(etatAnnee, inscriptionsExistantes, {
      nomEleve: eleve.identite.nom,
      prenomsEleve: eleve.identite.prenoms,
    });

    const maintenant = this.clock.maintenant();

    // Applique les renumérotations AVANT de créer la nouvelle inscription (ordre sans importance réelle, mais plus lisible ainsi).
    for (const renum of resultat.renumerotations) {
      const inscriptionAAjuster = await this.inscriptionRepository.obtenirParId(
        renum.inscriptionId
      );
      if (inscriptionAAjuster) {
        await this.inscriptionRepository.sauvegarder(
          inscriptionAAjuster.ajusterNumeroOrdre(renum.nouveauNumero, maintenant)
        );
      }
    }

    const inscription = Inscription.create(this.idGenerator.generer(), {
      etablissementId: input.etablissementId,
      eleveId: input.eleveId,
      classeId: input.classeId,
      anneeAcademiqueId: classe.anneeAcademiqueId,
      numeroOrdre: resultat.numeroAttribue,
      maintenant,
    });

    await this.inscriptionRepository.sauvegarder(inscription);
    return InscriptionMapper.versReadDto(inscription);
  }
}