import { Entity } from "~/shared/domain/entity";

// Doc section 3.6 — activations : simples liens configuration/référentiel,
// pas de cycle de vie propre (retrait = suppression de la ligne, gérée
// par le calcul différentiel côté repository, jamais un DELETE exposé).

interface FiliereActiveProps {
  configurationId: string;
  filiereId: string;
  dateCreation: string;
  creePar: string;
}

export class FiliereActive extends Entity<FiliereActiveProps> {
  static create(props: FiliereActiveProps, id: string): FiliereActive {
    return new FiliereActive(props, id);
  }

  get configurationId(): string {
    return this.props.configurationId;
  }
  get filiereId(): string {
    return this.props.filiereId;
  }
  get dateCreation(): string {
    return this.props.dateCreation;
  }
  get creePar(): string {
    return this.props.creePar;
  }
}

interface NiveauActiveProps {
  configurationId: string;
  niveauId: string;
  dateCreation: string;
  creePar: string;
}

export class NiveauActive extends Entity<NiveauActiveProps> {
  static create(props: NiveauActiveProps, id: string): NiveauActive {
    return new NiveauActive(props, id);
  }

  get configurationId(): string {
    return this.props.configurationId;
  }
  get niveauId(): string {
    return this.props.niveauId;
  }
  get dateCreation(): string {
    return this.props.dateCreation;
  }
  get creePar(): string {
    return this.props.creePar;
  }
}

interface SerieActiveProps {
  niveauActiveId: string;
  serieId: string;
  dateCreation: string;
  creePar: string;
}

export class SerieActive extends Entity<SerieActiveProps> {
  static create(props: SerieActiveProps, id: string): SerieActive {
    return new SerieActive(props, id);
  }

  get niveauActiveId(): string {
    return this.props.niveauActiveId;
  }
  get serieId(): string {
    return this.props.serieId;
  }
  get dateCreation(): string {
    return this.props.dateCreation;
  }
  get creePar(): string {
    return this.props.creePar;
  }
}
