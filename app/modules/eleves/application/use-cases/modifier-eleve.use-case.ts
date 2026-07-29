import type { UseCase } from "~/shared/domain/use-case";
import type { ClockPort } from "~/shared/application/ports";
import type { EleveRepository } from "../../domain/repositories/eleve.repository";
import { EleveIntrouvableError, MatriculeDejaExistantError } from "../../domain/errors/eleve.errors";
import { Identite } from "../../domain/shared/identite.vo";
import { EleveMapper } from "../mappers/eleve.mapper";
import type { ModifierEleveInputDto } from "../dto/eleve-write.dto";
import type { EleveReadDto } from "../dto/eleve-read.dto";

/** PATCH /eleves/{id} : chaque champ fourni est appliqué, les autres restent inchangés. */
export class ModifierEleveUseCase
  implements UseCase<{ eleveId: string; etablissementId: string; input: ModifierEleveInputDto }, EleveReadDto>
{
  constructor(
    private readonly eleveRepository: EleveRepository,
    private readonly clock: ClockPort
  ) {}

  async execute(params: {
    eleveId: string;
    etablissementId: string;
    input: ModifierEleveInputDto;
  }): Promise<EleveReadDto> {
    const { eleveId, etablissementId, input } = params;

    let eleve = await this.eleveRepository.obtenirParId(eleveId, etablissementId);
    if (!eleve) throw new EleveIntrouvableError(eleveId);

    const maintenant = this.clock.maintenant();

    // ELV-001 : re-vérifier l'unicité si le matricule change.
    if (input.matricule && input.matricule !== eleve.matricule) {
      const existant = await this.eleveRepository.obtenirParMatricule(
        input.matricule,
        etablissementId
      );
      if (existant && existant.id !== eleveId) {
        throw new MatriculeDejaExistantError(
          existant.nomComplet,
          existant.classeLibelle ?? "classe inconnue",
          existant.id
        );
      }
      eleve = eleve.changerMatricule(input.matricule, maintenant);
    }

    if (input.photoUrl) {
      eleve = eleve.changerPhoto(input.photoUrl, maintenant);
    }

    // Identité : reconstruite entièrement si au moins un champ change (le VO est immuable).
    const champsIdentiteModifies =
      input.nom || input.prenoms || input.sexe || input.dateNaissance || input.lieuNaissance;
    if (champsIdentiteModifies) {
      const nouvelleIdentite = Identite.create({
        nom: input.nom ?? eleve.identite.nom,
        prenoms: input.prenoms ?? eleve.identite.prenoms,
        sexe: input.sexe ?? eleve.identite.sexe,
        dateNaissance: input.dateNaissance ?? eleve.identite.dateNaissance,
        lieuNaissance: input.lieuNaissance ?? eleve.identite.lieuNaissance,
      });
      eleve = eleve.modifierIdentite(nouvelleIdentite, maintenant);
    }

    await this.eleveRepository.sauvegarder(eleve);
    return EleveMapper.versReadDto(eleve);
  }
}