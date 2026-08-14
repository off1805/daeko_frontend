import { Entity } from "~/shared/domain/entity";
import type { EtatConfiguration } from "~/modules/structure-pedagogique/domain/shared/etats";

// Doc section 3.5 — configuration branche × année : 1 par couple, scellée
// à la clôture de l'année (hors v1, voir le plan — reste toujours OUVERTE
// ici).

interface ConfigurationBrancheAnneeProps {
  brancheId: string;
  anneeAcademiqueId: string;
  etat: EtatConfiguration;
  dupliqueeDepuisId: string | null;
  dateScellement: string | null;
  dateCreation: string;
  dateModification: string;
  creePar: string;
  modifiePar: string;
}

export class ConfigurationBrancheAnnee extends Entity<ConfigurationBrancheAnneeProps> {
  static create(
    props: ConfigurationBrancheAnneeProps,
    id: string,
  ): ConfigurationBrancheAnnee {
    return new ConfigurationBrancheAnnee(props, id);
  }

  get brancheId(): string {
    return this.props.brancheId;
  }
  get anneeAcademiqueId(): string {
    return this.props.anneeAcademiqueId;
  }
  get etat(): EtatConfiguration {
    return this.props.etat;
  }
  get dupliqueeDepuisId(): string | null {
    return this.props.dupliqueeDepuisId;
  }
  get dateScellement(): string | null {
    return this.props.dateScellement;
  }
  get dateCreation(): string {
    return this.props.dateCreation;
  }
  get dateModification(): string {
    return this.props.dateModification;
  }
  get creePar(): string {
    return this.props.creePar;
  }
  get modifiePar(): string {
    return this.props.modifiePar;
  }
}
