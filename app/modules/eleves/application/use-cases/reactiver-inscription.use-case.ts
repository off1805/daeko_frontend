import type { UseCase } from "~/shared/domain/use-case";
import type { ClockPort } from "~/shared/application/ports";
import type { InscriptionRepository } from "../../domain/repositories/inscription.repository";
import type { EleveRepository } from "../../domain/repositories/eleve.repository";
import type { StructurePedagogiqueQueryPort } from "../ports/structure-pedagogique-query.port";
import { NumeroOrdreService } from "../../domain/services/numero-ordre.service";
import {
  InscriptionIntrouvableError,
  AnneeClotureeError,
} from "../../domain/errors/inscription.errors";
import { EleveIntrouvableError } from "../../domain/errors/eleve.errors";
import { InscriptionMapper } from "../mappers/inscription.mapper";
import type { InscriptionReadDto } from "../dto/inscription-read.dto";

export interface ReactiverInscriptionInputDto {
  inscriptionId: string;
  etablissementId: string;
}

/** CU-05, garde-fou : réactivation d'une inscription close par erreur (ELV-009). */
export class ReactiverInscriptionUseCase
  implements UseCase<ReactiverInscriptionInputDto, InscriptionReadDto>
{
  constructor(
    private readonly inscriptionRepository: InscriptionRepository,
    private readonly eleveRepository: EleveRepository,
    private readonly structurePedagogique: StructurePedagogiqueQueryPort,
    private readonly clock: ClockPort
  ) {}

  async execute(input: ReactiverInscriptionInputDto): Promise<InscriptionReadDto> {
    const inscription = await this.inscriptionRepository.obtenirParId(input.inscriptionId);
    if (!inscription) throw new InscriptionIntrouvableError(input.inscriptionId);

    const eleve = await this.eleveRepository.obtenirParId(
      inscription.eleveId,
      input.etablissementId
    );
    if (!eleve) throw new EleveIntrouvableError(inscription.eleveId);

    // ELV-005/ELV-009 : impossible si l'année est déjà clôturée.
    const etatAnnee = await this.structurePedagogique.obtenirEtatAnnee(
      inscription.anneeAcademiqueId
    );
    if (etatAnnee === "CLOTUREE") {
      throw new AnneeClotureeError(inscription.anneeAcademiqueId);
    }

    const inscriptionsClasse = await this.inscriptionRepository.listerActivesPourNumerotation(
      inscription.classeId
    );
    const resultat = NumeroOrdreService.attribuer(
      etatAnnee ?? "EN_COURS",
      inscriptionsClasse,
      { nomEleve: eleve.identite.nom, prenomsEleve: eleve.identite.prenoms }
    );

    const maintenant = this.clock.maintenant();

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

    const inscriptionReactivee = inscription.reactiver(resultat.numeroAttribue, maintenant);
    await this.inscriptionRepository.sauvegarder(inscriptionReactivee);
    return InscriptionMapper.versReadDto(inscriptionReactivee);
  }
}