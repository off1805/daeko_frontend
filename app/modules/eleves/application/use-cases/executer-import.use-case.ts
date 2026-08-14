import type { UseCase } from "~/shared/domain/use-case";
import type { ImportLotRepository } from "../../domain/repositories/import-lot.repository";
import type { ImportLigneRepository } from "../../domain/repositories/import-ligne.repository";
import { DomainError } from "~/shared/domain/domain-error";
import { CreerEleveUseCase } from "./creer-eleve.use-case";
import { InscrireEleveUseCase } from "./inscrire-eleve.use-case";
import type { LienParente } from "../../domain/shared/lien-parente";
import { ImportMapper } from "../mappers/import.mapper";
import type { ImportLotReadDto } from "../dto/import-read.dto";

export interface ExecuterImportInputDto {
  lotId: string;
  etablissementId: string;
  acteurId: string;
}

const TAILLE_PAGE = 100;

export class ExecuterImportUseCase
  implements UseCase<ExecuterImportInputDto, ImportLotReadDto>
{
  constructor(
    private readonly importLotRepository: ImportLotRepository,
    private readonly importLigneRepository: ImportLigneRepository,
    private readonly creerEleveUseCase: CreerEleveUseCase,
    private readonly inscrireEleveUseCase: InscrireEleveUseCase
  ) {}

  async execute(input: ExecuterImportInputDto): Promise<ImportLotReadDto> {
    let lot = await this.importLotRepository.obtenirParId(
      input.lotId,
      input.etablissementId
    );
    if (!lot) throw new Error("Lot d'import introuvable.");

    lot = lot.demarrerExecution(); // ELV-011 si pas encore PREVISUALISE
    await this.importLotRepository.sauvegarder(lot);

    let page = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const resultatPage = await this.importLigneRepository.listerParLotParPage(
        lot.id,
        page,
        TAILLE_PAGE
      );
      if (resultatPage.items.length === 0) break;

      for (const ligne of resultatPage.items) {
        if (ligne.statut !== "VALIDE") continue; // déjà traitée précédemment, on ne repasse jamais dessus

        try {
          const champs = this.appliquerCorrespondance(
            ligne.donneesBrutes,
            lot.correspondanceColonnes
          );

          const eleveDto = await this.creerEleveUseCase.execute({
            etablissementId: input.etablissementId,
            matricule: champs.matricule,
            nom: champs.nom,
            prenoms: champs.prenoms,
            sexe: champs.sexe as "M" | "F",
            dateNaissance: champs.date_naissance,
            tuteurs: [
              {
                nom: champs.tuteur_nom,
                telephone: champs.tuteur_telephone,
                lienParente: (champs.tuteur_lien_parente as LienParente) ?? "AUTRE",
                estContactPrincipal: true,
              },
            ],
          });

          if (lot.classeCibleId) {
            await this.inscrireEleveUseCase.execute({
              etablissementId: input.etablissementId,
              eleveId: eleveDto.id,
              classeId: lot.classeCibleId,
            });
          }

          const ligneTraitee = ligne.marquerCreee(eleveDto.id);
          await this.importLigneRepository.sauvegarder(ligneTraitee);
          lot = lot.enregistrerResultatLigne("CREEE");
        } catch (erreur) {
          const code = erreur instanceof DomainError ? erreur.code : "ELV-011";
          const message =
            erreur instanceof Error ? erreur.message : "Erreur inconnue lors du traitement.";

          const ligneRejetee = ligne.marquerRejetee(code, message);
          await this.importLigneRepository.sauvegarder(ligneRejetee);
          lot = lot.enregistrerResultatLigne("REJETEE");
        }

        // Sauvegarde du lot après CHAQUE ligne : la progression reste consultable en temps réel (§5.4).
        await this.importLotRepository.sauvegarder(lot);
      }

      if (resultatPage.items.length < TAILLE_PAGE) break;
      page++;
    }

    lot = lot.terminer();
    await this.importLotRepository.sauvegarder(lot);
    return ImportMapper.lotVersDto(lot);
  }

  /** Traduit les en-têtes brutes du fichier vers les champs canoniques de la plateforme, via la correspondance choisie. */
  private appliquerCorrespondance(
    donneesBrutes: Readonly<Record<string, string>>,
    correspondance: Readonly<Record<string, string>>
  ): Record<string, string> {
    const resultat: Record<string, string> = {};
    for (const [colonneFichier, champPlateforme] of Object.entries(correspondance)) {
      resultat[champPlateforme] = donneesBrutes[colonneFichier] ?? "";
    }
    return resultat;
  }
}