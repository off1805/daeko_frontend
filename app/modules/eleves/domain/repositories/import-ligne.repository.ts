import { ImportLigne } from "../entities/import-ligne.entity";

export interface PageResultat<T> {
  items: T[];
  total: number;
  page: number;
  taille: number;
}


export interface ImportLigneRepository {
  /** §4.5 : parcours du lot pour l'exécution — pensé en pagination/streaming, jamais tout en mémoire d'un coup pour un gros fichier. */
  listerParLotParPage(
    lotId: string,
    page: number,
    taille: number
  ): Promise<PageResultat<ImportLigne>>;

  /** GET /imports/{id}/rejets — également exportable en CSV côté infrastructure. */
  listerRejeteesParLot(lotId: string): Promise<ImportLigne[]>;

  /** Sauvegarde une seule ligne — appelée après chaque traitement individuel (§4.5, transaction par ligne). */
  sauvegarder(ligne: ImportLigne): Promise<void>;

  /** Insertion initiale de toutes les lignes brutes lors du téléversement — un batch d'écriture, pas une lecture ligne par ligne. */
  creerLot(lignes: ImportLigne[]): Promise<void>;
}