import type { UseCase } from "~/shared/domain/use-case";
import type { ClockPort, IdGeneratorPort } from "~/shared/application/ports";
import type { EleveRepository } from "../../domain/repositories/eleve.repository";
import type { InscriptionRepository } from "../../domain/repositories/inscription.repository";
import type { StructurePedagogiqueQueryPort } from "../ports/structure-pedagogique-query.port";
import { EleveIntrouvableError } from "../../domain/errors/eleve.errors";
import {
  AnneeClotureeError,
  ClasseIndisponibleError,
  InscriptionActiveExistanteError,
} from "../../domain/errors/inscription.errors";
import { Inscription } from "../../domain/entities/inscription.entity";
import { InscriptionMapper } from "../mappers/inscription.mapper";
import type { InscriptionReadDto } from "../dto/inscription-read.dto";
import { NumeroOrdreService } from "../../domain/services/numero-ordre.service";

export interface CreerInscriptionInputDto {
  etablissementId: string;
  eleveId: string;
  classeId: string;
  anneeAcademiqueId: string;
  motif?: string;
}

/** CU-03 : création d’une inscription active pour une année et une classe. */
export class CreerInscriptionUseCase
  implements UseCase<CreerInscriptionInputDto, InscriptionReadDto>
{
  constructor(
    private readonly eleveRepository: EleveRepository,
    private readonly inscriptionRepository: InscriptionRepository,
    private readonly structurePedagogiqueQueryPort: StructurePedagogiqueQueryPort,
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort
  ) {}

  async execute(input: CreerInscriptionInputDto): Promise<InscriptionReadDto> {
    const eleve = await this.eleveRepository.obtenirParId(
      input.eleveId,
      input.etablissementId
    );
    if (!eleve) {
      throw new EleveIntrouvableError(input.eleveId);
    }

    const classe = await this.structurePedagogiqueQueryPort.obtenirClasse(input.classeId);
    if (!classe || !classe.estActive) {
      throw new ClasseIndisponibleError();
    }

    const etatAnnee = await this.structurePedagogiqueQueryPort.obtenirEtatAnnee(
      input.anneeAcademiqueId
    );
    if (!etatAnnee) {
      throw new AnneeClotureeError("année inconnue");
    }
    if (etatAnnee === "CLOTUREE") {
      throw new AnneeClotureeError("année académique");
    }

    const inscriptionExistante = await this.inscriptionRepository.obtenirInscriptionActive(
      input.eleveId,
      input.anneeAcademiqueId
    );
    if (inscriptionExistante) {
      throw new InscriptionActiveExistanteError(
        inscriptionExistante.classeId,
        inscriptionExistante.id
      );
    }

    const inscriptionsActives = await this.inscriptionRepository.listerActivesPourNumerotation(
      input.classeId
    );

    const maintenant = this.clock.maintenant();
    const resultatNumerotation = NumeroOrdreService.attribuer(
      etatAnnee,
      inscriptionsActives,
      {
        nomEleve: eleve.identite.nom,
        prenomsEleve: eleve.identite.prenoms,
      }
    );

    const inscription = Inscription.create(this.idGenerator.generer(), {
      etablissementId: input.etablissementId,
      eleveId: input.eleveId,
      classeId: input.classeId,
      anneeAcademiqueId: input.anneeAcademiqueId,
      numeroOrdre: resultatNumerotation.numeroAttribue,
      maintenant,
    });

    await this.inscriptionRepository.sauvegarder(inscription);
    return InscriptionMapper.versReadDto(inscription);
  }
}
