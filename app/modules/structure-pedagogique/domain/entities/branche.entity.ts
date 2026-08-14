import { Entity } from "~/shared/domain/entity";
import type { EtatBranche } from "~/modules/structure-pedagogique/domain/shared/etats";

// Doc section 3.2 — branche : triplet (sous-système, ordre, type) IMMUABLE
// après création (SP-019). Permanente : elle traverse les années, seules
// ses ConfigurationBrancheAnnee sont annuelles (doc 1.3).

interface BrancheProps {
  sousSystemeId: string;
  ordreEnseignementId: string;
  typeEnseignementId: string;
  libelle: string;
  etat: EtatBranche;
  motifArchivage?: string;
  dateCreation: string;
  dateModification: string;
  creePar: string;
  modifiePar: string;
}

export class Branche extends Entity<BrancheProps> {
  static create(props: BrancheProps, id: string): Branche {
    return new Branche(props, id);
  }

  get sousSystemeId(): string {
    return this.props.sousSystemeId;
  }
  get ordreEnseignementId(): string {
    return this.props.ordreEnseignementId;
  }
  get typeEnseignementId(): string {
    return this.props.typeEnseignementId;
  }
  get libelle(): string {
    return this.props.libelle;
  }
  get etat(): EtatBranche {
    return this.props.etat;
  }
  get motifArchivage(): string | undefined {
    return this.props.motifArchivage;
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
