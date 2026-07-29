import type { UseCase } from "~/shared/domain/use-case";
import type { IdGeneratorPort, ClockPort } from "~/shared/application/ports";
import { Eleve } from "../../domain/entities/eleve.entity";
import { Tuteur } from "../../domain/entities/tuteur.entity";
import { Identite } from "../../domain/shared/identite.vo";
import type { EleveRepository } from "../../domain/repositories/eleve.repository";
import { MatriculeDejaExistantError } from "../../domain/errors/eleve.errors";
import { EleveMapper } from "../mappers/eleve.mapper";
import type { CreerEleveInputDto } from "../dto/eleve-write.dto";
import type { EleveReadDto } from "../dto/eleve-read.dto";


export class CreerEleveUseCase
  implements UseCase<CreerEleveInputDto, EleveReadDto>
{
  constructor(
    private readonly eleveRepository: EleveRepository,
    private readonly idGenerator: IdGeneratorPort,
    private readonly clock: ClockPort
  ) {}

  async execute(input: CreerEleveInputDto): Promise<EleveReadDto> {
    // ELV-001 : unicité du matricule DANS l'établissement, pas globalement.
    const existant = await this.eleveRepository.obtenirParMatricule(
      input.matricule,
      input.etablissementId
    );
    if (existant) {
      throw new MatriculeDejaExistantError(
        existant.nomComplet,
        existant.classeLibelle ?? "classe inconnue",
        existant.id
      );
    }

    const maintenant = this.clock.maintenant();

    // L'id de l'élève est généré EN PREMIER, pour que chaque tuteur
    // connaisse déjà eleveId dès sa création — plus besoin de
    // reconstruire quoi que ce soit après coup.
    const eleveId = this.idGenerator.generer();

    const tuteurs = input.tuteurs.map((t) => {
      const tuteur = Tuteur.create(this.idGenerator.generer(), {
        eleveId,
        nom: t.nom,
        lienParente: t.lienParente,
        telephone: t.telephone,
        profession: t.profession,
        adresse: t.adresse,
      });
      return t.estContactPrincipal ? tuteur.avecStatutPrincipal(true) : tuteur;
    });

    const eleve = Eleve.create(eleveId, {
      etablissementId: input.etablissementId,
      matricule: input.matricule,
      identite: Identite.create({
        nom: input.nom,
        prenoms: input.prenoms,
        sexe: input.sexe,
        dateNaissance: input.dateNaissance,
        lieuNaissance: input.lieuNaissance,
      }),
      photoUrl: input.photoUrl,
      premiersTuteurs: tuteurs,
      maintenant,
    });

    await this.eleveRepository.sauvegarder(eleve);
    return EleveMapper.versReadDto(eleve);
  }
}