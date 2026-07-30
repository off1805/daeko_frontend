import { ImportLot } from "../../domain/entities/import-lot.entity";
import { ImportLigne } from "../../domain/entities/import-ligne.entity";
import type { ImportLotRepository } from "../../domain/repositories/import-lot.repository";
import type {
  ImportLigneRepository,
  PageResultat,
} from "../../domain/repositories/import-ligne.repository";

export class InMemoryImportLotRepository implements ImportLotRepository {
  private lots: Map<string, ImportLot> = new Map();

  async obtenirParId(id: string, etablissementId: string): Promise<ImportLot | null> {
    const lot = this.lots.get(id);
    if (!lot || lot.etablissementId !== etablissementId) return null;
    return lot;
  }

  async sauvegarder(lot: ImportLot): Promise<void> {
    this.lots.set(lot.id, lot);
  }
}


export class InMemoryImportLigneRepository implements ImportLigneRepository {
  private lignes: Map<string, ImportLigne> = new Map();

  async listerParLotParPage(
    lotId: string,
    page: number,
    taille: number
  ): Promise<PageResultat<ImportLigne>> {
    const toutes = Array.from(this.lignes.values())
      .filter((l) => l.lotId === lotId)
      .sort((a, b) => a.numeroLigne - b.numeroLigne);

    const debut = (page - 1) * taille;
    const items = toutes.slice(debut, debut + taille);

    return { items, total: toutes.length, page, taille };
  }

  async listerRejeteesParLot(lotId: string): Promise<ImportLigne[]> {
    return Array.from(this.lignes.values())
      .filter((l) => l.lotId === lotId && l.statut === "REJETEE")
      .sort((a, b) => a.numeroLigne - b.numeroLigne);
  }

  async sauvegarder(ligne: ImportLigne): Promise<void> {
    this.lignes.set(ligne.id, ligne);
  }

  async creerLot(lignes: ImportLigne[]): Promise<void> {
    for (const ligne of lignes) {
      this.lignes.set(ligne.id, ligne);
    }
  }
}