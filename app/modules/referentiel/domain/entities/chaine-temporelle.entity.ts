import {
  ReferentielEntity,
  type ReferentielLifecycle,
} from "~/modules/referentiel/domain/shared/referentiel-entity";
import { LibelleBilingue } from "~/modules/referentiel/domain/shared/libelle-bilingue.vo";

// Doc section 3.4 — chaîne temporelle : cycle et niveau.

interface CycleProps {
  sousSystemeId: string;
  ordreEnseignementId: string;
  code: string;
  libelle: LibelleBilingue;
  rang: number;
  dureeTheoriqueAnnees: number;
  description?: string;
}

export class Cycle extends ReferentielEntity<CycleProps> {
  static create(props: CycleProps & ReferentielLifecycle, id: string): Cycle {
    return new Cycle(props, id);
  }

  get sousSystemeId(): string {
    return this.props.sousSystemeId;
  }
  get ordreEnseignementId(): string {
    return this.props.ordreEnseignementId;
  }
  get code(): string {
    return this.props.code;
  }
  get libelle(): LibelleBilingue {
    return this.props.libelle;
  }
  get rang(): number {
    return this.props.rang;
  }
  get dureeTheoriqueAnnees(): number {
    return this.props.dureeTheoriqueAnnees;
  }
  get description(): string | undefined {
    return this.props.description;
  }
}

interface NiveauProps {
  cycleId: string;
  code: string;
  libelle: LibelleBilingue;
  libelleCourt?: string;
  rangDansCycle: number;
  ageTheoriqueDebut?: number;
  description?: string;
}

export class Niveau extends ReferentielEntity<NiveauProps> {
  static create(
    props: NiveauProps & ReferentielLifecycle,
    id: string,
  ): Niveau {
    return new Niveau(props, id);
  }

  get cycleId(): string {
    return this.props.cycleId;
  }
  get code(): string {
    return this.props.code;
  }
  get libelle(): LibelleBilingue {
    return this.props.libelle;
  }
  get libelleCourt(): string | undefined {
    return this.props.libelleCourt;
  }
  get rangDansCycle(): number {
    return this.props.rangDansCycle;
  }
  get ageTheoriqueDebut(): number | undefined {
    return this.props.ageTheoriqueDebut;
  }
  get description(): string | undefined {
    return this.props.description;
  }
}
