import {
  ReferentielEntity,
  type ReferentielLifecycle,
} from "~/modules/referentiel/domain/shared/referentiel-entity";
import { LibelleBilingue } from "~/modules/referentiel/domain/shared/libelle-bilingue.vo";

// Doc section 3.5 — chaîne pédagogique : filière et série.

interface FiliereProps {
  ordreEnseignementId: string;
  typeEnseignementId: string;
  code: string;
  libelle: LibelleBilingue;
  description?: string;
}

export class Filiere extends ReferentielEntity<FiliereProps> {
  static create(
    props: FiliereProps & ReferentielLifecycle,
    id: string,
  ): Filiere {
    return new Filiere(props, id);
  }

  get ordreEnseignementId(): string {
    return this.props.ordreEnseignementId;
  }
  get typeEnseignementId(): string {
    return this.props.typeEnseignementId;
  }
  get code(): string {
    return this.props.code;
  }
  get libelle(): LibelleBilingue {
    return this.props.libelle;
  }
  get description(): string | undefined {
    return this.props.description;
  }
}

interface SerieProps {
  filiereId: string;
  niveauApparitionId: string;
  code: string;
  libelle: LibelleBilingue;
  libelleCourt?: string;
  description?: string;
}

export class Serie extends ReferentielEntity<SerieProps> {
  static create(props: SerieProps & ReferentielLifecycle, id: string): Serie {
    return new Serie(props, id);
  }

  get filiereId(): string {
    return this.props.filiereId;
  }
  get niveauApparitionId(): string {
    return this.props.niveauApparitionId;
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
  get description(): string | undefined {
    return this.props.description;
  }
}
