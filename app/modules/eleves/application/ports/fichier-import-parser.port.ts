export interface EnTetesFichier {
  colonnes: string[];
  nombreLignesEstime: number;
}

export interface LigneFichierBrute {
  numeroLigne: number;
  /** Clés = en-têtes ORIGINALES du fichier, non traduites (le mapping se fait côté application). */
  donneesBrutes: Record<string, string>;
}


export interface FichierImportParserPort {
  detecterEntetes(fichierRef: string): Promise<EnTetesFichier>;
  lireLignesBrutes(fichierRef: string): AsyncIterable<LigneFichierBrute>;
}