import { ValueObject } from "~/shared/domain/value-object";
import { EnteteLigne } from "./entete-ligne.vo";
import { EnteteIncompletError } from "../errors/etablissement.errors";

export type ModeEntete = "SIMPLE" | "BILINGUE";
export type Langue = "FR" | "EN";

interface EnteteProps {
  mode: ModeEntete;
  langue?: Langue;
  lignes: EnteteLigne[];
}

export class Entete extends ValueObject<EnteteProps> {
  private constructor(props: EnteteProps) {
    super(props);
  }

  static simple(langue: Langue, lignes: EnteteLigne[]): Entete {
    const predicat =
      langue === "FR"
        ? (l: EnteteLigne) => l.possedeVersionFrancaise
        : (l: EnteteLigne) => l.possedeVersionAnglaise;
    Entete.verifier(lignes, predicat, langue === "FR" ? "française" : "anglaise");
    return new Entete({ mode: "SIMPLE", langue, lignes: Entete.trier(lignes) });
  }

  /** @throws EnteteIncompletError listant les ordres de lignes incomplètes (RM-06, CU-02 E2). */
  static bilingue(lignes: EnteteLigne[]): Entete {
    Entete.verifier(lignes, (l) => l.possedeVersionFrancaise, "française");
    Entete.verifier(lignes, (l) => l.possedeVersionAnglaise, "anglaise");
    return new Entete({ mode: "BILINGUE", lignes: Entete.trier(lignes) });
  }

  private static verifier(
    lignes: EnteteLigne[],
    predicat: (l: EnteteLigne) => boolean,
    nomVersion: "française" | "anglaise"
  ): void {
    const incompletes = lignes.filter((l) => !predicat(l));
    if (incompletes.length > 0) {
      throw new EnteteIncompletError(
        incompletes.map((l) => l.ordre),
        nomVersion
      );
    }
  }

  private static trier(lignes: EnteteLigne[]): EnteteLigne[] {
    return [...lignes].sort((a, b) => a.ordre - b.ordre);
  }

  get mode(): ModeEntete {
    return this.props.mode;
  }

  get langue(): Langue | undefined {
    return this.props.langue;
  }

  get lignes(): readonly EnteteLigne[] {
    return this.props.lignes;
  }

  get estComplet(): boolean {
    if (this.props.lignes.length === 0) return false;
    if (this.props.mode === "BILINGUE") {
      return this.props.lignes.every(
        (l) => l.possedeVersionFrancaise && l.possedeVersionAnglaise
      );
    }
    return this.props.langue === "FR"
      ? this.props.lignes.every((l) => l.possedeVersionFrancaise)
      : this.props.lignes.every((l) => l.possedeVersionAnglaise);
  }

  static genererStandard(
    mode: ModeEntete,
    langueSiSimple: Langue | undefined,
    ministereTutelleFr: string,
    ministereTutelleEn: string,
    delegationRegionaleFr: string,
    delegationRegionaleEn: string,
    delegationDepartementaleFr: string,
    delegationDepartementaleEn: string,
    nomEtablissement: string
  ): Entete {
    const paires: [string, string][] = [
      ["République du Cameroun", "Republic of Cameroon"],
      ["Paix - Travail - Patrie", "Peace - Work - Fatherland"],
      [ministereTutelleFr, ministereTutelleEn],
      [delegationRegionaleFr, delegationRegionaleEn],
      [delegationDepartementaleFr, delegationDepartementaleEn],
      [nomEtablissement, nomEtablissement],
    ];

    const lignes = paires.map(([fr, en], index) =>
      EnteteLigne.create({ ordre: index, texteFr: fr, texteEn: en })
    );

    if (mode === "BILINGUE") {
      return Entete.bilingue(lignes);
    }
    if (!langueSiSimple) {
      throw new Error("La langue est obligatoire en mode SIMPLE.");
    }
    return Entete.simple(langueSiSimple, lignes);
  }
}