import type {
  FichierImportParserPort,
  EnTetesFichier,
  LigneFichierBrute,
} from "../../application/ports/fichier-import-parser.port";

/**
 *FAUSSE implémentation, pour permettre au module de fonctionner
 * sans dépendre tout de suite d'une vraie librairie de lecture Excel
 * (SheetJS, déjà listée comme disponible dans l'environnement). Elle
 * simule un petit fichier fixe de 2 lignes, une valide et une qui
 * échouera volontairement (téléphone tuteur vide) — utile pour tester
 * ExecuterImportUseCase de bout en bout, rejets compris.
 *
 * À remplacer plus tard par une vraie implémentation utilisant XLSX
 * (voir compétence pptx/xlsx de l'environnement) en lecture flux.
 */
export class FakeFichierImportParser implements FichierImportParserPort {
  async detecterEntetes(_fichierRef: string): Promise<EnTetesFichier> {
    return {
      colonnes: ["Matricule", "Nom", "Prénoms", "Sexe", "Naissance", "Tuteur", "Téléphone"],
      nombreLignesEstime: 2,
    };
  }

  async *lireLignesBrutes(_fichierRef: string): AsyncIterable<LigneFichierBrute> {
    yield {
      numeroLigne: 1,
      donneesBrutes: {
        Matricule: "MAT-2025-010",
        Nom: "ATANGANA",
        Prénoms: "Élise",
        Sexe: "F",
        Naissance: "2011-05-01",
        Tuteur: "ATANGANA Robert",
        Téléphone: "690112233",
      },
    };
    yield {
      numeroLigne: 2,
      donneesBrutes: {
        Matricule: "MAT-2025-011",
        Nom: "BIYA",
        Prénoms: "Rosine",
        Sexe: "F",
        Naissance: "2011-08-19",
        Tuteur: "BIYA Martin",
        Téléphone: "", // volontairement vide -> devrait être rejetée à l'exécution
      },
    };
  }
}