import type { UseCase } from "~/shared/domain/use-case";
import type { ImportLotRepository } from "../../domain/repositories/import-lot.repository";
import type { ImportLigneRepository } from "../../domain/repositories/import-ligne.repository";
import type { PrevisualisationLigneDto } from "../dto/import-read.dto";

export interface PrevisualiserImportInputDto {
  lotId: string;
  etablissementId: string;
}

export interface PrevisualiserImportResultDto {
  lignes: PrevisualisationLigneDto[]; // les 10 premières, dossier technique §5.4
}

/** GET /imports/{id}/previsualisation : aperçu, sans rien créer — juste un contrôle visuel. */
export class PrevisualiserImportUseCase
  implements UseCase<PrevisualiserImportInputDto, PrevisualiserImportResultDto>
{
  constructor(
    private readonly importLotRepository: ImportLotRepository,
    private readonly importLigneRepository: ImportLigneRepository
  ) {}

  async execute(input: PrevisualiserImportInputDto): Promise<PrevisualiserImportResultDto> {
    const lot = await this.importLotRepository.obtenirParId(
      input.lotId,
      input.etablissementId
    );
    if (!lot) throw new Error("Lot d'import introuvable.");

    const page = await this.importLigneRepository.listerParLotParPage(input.lotId, 1, 10);

    const lignes: PrevisualisationLigneDto[] = page.items.map((ligne) => {
      const donneesInterpretees: Record<string, string> = {};
      const problemesDetectes: string[] = [];

      for (const [colonneFichier, champPlateforme] of Object.entries(
        lot.correspondanceColonnes
      )) {
        const valeur = ligne.donneesBrutes[colonneFichier] ?? "";
        if (!valeur.trim()) {
          problemesDetectes.push(`Champ "${champPlateforme}" vide.`);
        }
        donneesInterpretees[champPlateforme] = valeur;
      }

      return { numeroLigne: ligne.numeroLigne, donneesInterpretees, problemesDetectes };
    });

    const lotPrevisualise = lot.marquerPrevisualise();
    await this.importLotRepository.sauvegarder(lotPrevisualise);

    return { lignes };
  }
}