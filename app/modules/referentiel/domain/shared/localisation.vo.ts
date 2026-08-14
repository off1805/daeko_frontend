import { ValueObject } from "~/shared/domain/value-object";

interface LocalisationProps {
  regionId: string;
  regionLibelle: string;
  departementId: string;
  departementLibelle: string;
  arrondissementId: string;
  arrondissementLibelle: string;
  /** Déduit de la région (2.3 : "Délégation Régionale de l'Est"). */
  delegationRegionaleLibelle: string;
  /** Déduit du département (2.3 : "Délégation Départementale du Lom-et-Djerem"). */
  delegationDepartementaleLibelle: string;
}


export class Localisation extends ValueObject<LocalisationProps> {
  private constructor(props: LocalisationProps) {
    super(props);
  }

  static create(props: LocalisationProps): Localisation {
    const champsObligatoires: (keyof LocalisationProps)[] = [
      "regionId",
      "regionLibelle",
      "departementId",
      "departementLibelle",
      "arrondissementId",
      "arrondissementLibelle",
      "delegationRegionaleLibelle",
      "delegationDepartementaleLibelle",
    ];

    for (const champ of champsObligatoires) {
      if (!props[champ]?.trim()) {
        throw new Error(
          `Localisation incomplète : le champ "${champ}" est obligatoire.`
        );
      }
    }

    return new Localisation({ ...props });
  }

  get regionId(): string {
    return this.props.regionId;
  }

  get regionLibelle(): string {
    return this.props.regionLibelle;
  }

  get departementId(): string {
    return this.props.departementId;
  }

  get departementLibelle(): string {
    return this.props.departementLibelle;
  }

  get arrondissementId(): string {
    return this.props.arrondissementId;
  }

  get arrondissementLibelle(): string {
    return this.props.arrondissementLibelle;
  }

  get delegationRegionaleLibelle(): string {
    return this.props.delegationRegionaleLibelle;
  }

  get delegationDepartementaleLibelle(): string {
    return this.props.delegationDepartementaleLibelle;
  }
}