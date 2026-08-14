import { ImportLot } from "../entities/import-lot.entity";

export interface ImportLotRepository {
  obtenirParId(id: string, etablissementId: string): Promise<ImportLot | null>;
  sauvegarder(lot: ImportLot): Promise<void>;
}