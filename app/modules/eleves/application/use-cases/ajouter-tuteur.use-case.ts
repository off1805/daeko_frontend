import type { UseCase } from "~/shared/domain/use-case";
import type { IdGeneratorPort, ClockPort } from "~/shared/application/ports";
import type { EleveRepository } from "../../domain/repositories/eleve.repository";
import { EleveIntrouvableError } from "../../domain/errors/eleve.errors";
import { Tuteur } from "../../domain/entities/tuteur.entity";
import { EleveMapper } from "../mappers/eleve.mapper";
import type { CreerTuteurInputDto } from "../dto/eleve-write.dto";
import type { EleveReadDto } from "../dto/eleve-read.dto";

/** POST /eleves/{id}/tuteurs. */
export class AjouterTuteurUseCase
  implements UseCase<{ eleveId: string; etablissementId: string; input: CreerTuteurInputDto }, EleveReadDto>
{
  constructor(
    private readonly eleveRepository: EleveRepository,
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort
  ) {}

  async execute(params: {
    eleveId: string;
    etablissementId: string;
    input: CreerTuteurInputDto;
  }): Promise<EleveReadDto> {
    const eleve = await this.eleveRepository.obtenirParId(
      params.eleveId,
      params.etablissementId
    );
    if (!eleve) throw new EleveIntrouvableError(params.eleveId);

    const maintenant = this.clock.maintenant();
    let tuteur = Tuteur.create(this.idGenerator.generer(), {
      eleveId: params.eleveId,
      nom: params.input.nom,
      lienParente: params.input.lienParente,
      telephone: params.input.telephone,
      profession: params.input.profession,
      adresse: params.input.adresse,
    });
    if (params.input.estContactPrincipal) {
      tuteur = tuteur.avecStatutPrincipal(true);
    }

    const eleveMisAJour = eleve.ajouterTuteur(tuteur, maintenant);
    await this.eleveRepository.sauvegarder(eleveMisAJour);
    return EleveMapper.versReadDto(eleveMisAJour);
  }
}