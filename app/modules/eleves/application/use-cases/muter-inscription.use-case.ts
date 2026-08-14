import type { UseCase } from "~/shared/domain/use-case";
import type { IdGeneratorPort, ClockPort } from "~/shared/application/ports";
import type { InscriptionRepository } from "../../domain/repositories/inscription.repository";
import type { EleveRepository } from "../../domain/repositories/eleve.repository";
import type { StructurePedagogiqueQueryPort } from "../ports/structure-pedagogique-query.port";
import { NumeroOrdreService } from "../../domain/services/numero-ordre.service";
import {
  InscriptionIntrouvableError,
  ClasseIndisponibleError,
  AnneeClotureeError,
} from "../../domain/errors/inscription.errors";
import { EleveIntrouvableError } from "../../domain/errors/eleve.errors";
import { InscriptionMapper } from "../mappers/inscription.mapper";
import type { InscriptionReadDto } from "../dto/inscription-read.dto";

export interface MuterInscriptionInputDto {
  inscriptionId: string;
  etablissementId: string;
  classeCibleId: string;
  motif: string;
  acteurId: string;
}

/** CU-04 : mutation d'un élève vers une autre classe, en cours d'année (RM-E-08, ELV-012). */
export class MuterInscriptionUseCase
  implements UseCase<MuterInscriptionInputDto, InscriptionReadDto>
{
  constructor(
    private readonly inscriptionRepository: InscriptionRepository,
    private readonly eleveRepository: EleveRepository,
    private readonly structurePedagogique: StructurePedagogiqueQueryPort,
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort
  ) {}

  async execute(input: MuterInscriptionInputDto): Promise<InscriptionReadDto> {
    const inscription = await this.inscriptionRepository.obtenirParId(input.inscriptionId);
    if (!inscription) throw new InscriptionIntrouvableError(input.inscriptionId);

    const eleve = await this.eleveRepository.obtenirParId(
      inscription.eleveId,
      input.etablissementId
    );
    if (!eleve) throw new EleveIntrouvableError(inscription.eleveId);

    // ELV-004 : classe cible existante et active.
    const classeCible = await this.structurePedagogique.obtenirClasse(input.classeCibleId);
    if (!classeCible || !classeCible.estActive) {
      throw new ClasseIndisponibleError();
    }

    // ELV-005 : année non clôturée.
    const etatAnnee = await this.structurePedagogique.obtenirEtatAnnee(
      classeCible.anneeAcademiqueId
    );
    if (!etatAnnee) throw new ClasseIndisponibleError();
    if (etatAnnee === "CLOTUREE") {
      throw new AnneeClotureeError(classeCible.anneeAcademiqueId);
    }

    // RM-E-07 : l'élève est traité comme un arrivant dans la classe cible.
    const inscriptionsClasseCible = await this.inscriptionRepository.listerActivesPourNumerotation(
      input.classeCibleId
    );
    const resultat = NumeroOrdreService.attribuer(etatAnnee, inscriptionsClasseCible, {
      nomEleve: eleve.identite.nom,
      prenomsEleve: eleve.identite.prenoms,
    });

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

    const inscriptionMutee = inscription.muter(
      input.classeCibleId,
      resultat.numeroAttribue,
      input.motif,
      input.acteurId,
      this.idGenerator.generer(),
      maintenant
    );

    await this.inscriptionRepository.sauvegarder(inscriptionMutee);
    return InscriptionMapper.versReadDto(inscriptionMutee);
  }
}