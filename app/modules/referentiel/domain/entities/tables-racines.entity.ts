import {
  ReferentielEntity,
  type ReferentielLifecycle,
} from "~/modules/referentiel/domain/shared/referentiel-entity";
import { LibelleBilingue } from "~/modules/referentiel/domain/shared/libelle-bilingue.vo";

// Doc section 3.3 — tables racines : sous_systeme, ordre_enseignement, type_enseignement.
// Aucune de ces trois tables ne porte de colonne libelle_en pour son libellé
// principal (voir DDL) : libelle reste une simple chaîne, pas de VO bilingue.

interface SousSystemeProps {
  code: string;
  libelle: string;
  libelleCourt?: string;
  description?: string;
  languePrincipale: string; // ISO 639-1
}

export class SousSysteme extends ReferentielEntity<SousSystemeProps> {
  static create(
    props: SousSystemeProps & ReferentielLifecycle,
    id: string,
  ): SousSysteme {
    return new SousSysteme(props, id);
  }

  get code(): string {
    return this.props.code;
  }
  get libelle(): string {
    return this.props.libelle;
  }
  get libelleCourt(): string | undefined {
    return this.props.libelleCourt;
  }
  get description(): string | undefined {
    return this.props.description;
  }
  get languePrincipale(): string {
    return this.props.languePrincipale;
  }
}

interface OrdreEnseignementProps {
  code: string;
  libelle: string;
  tutelleMinisterielle?: LibelleBilingue;
  rang: number;
  description?: string;
}

export class OrdreEnseignement extends ReferentielEntity<OrdreEnseignementProps> {
  static create(
    props: OrdreEnseignementProps & ReferentielLifecycle,
    id: string,
  ): OrdreEnseignement {
    return new OrdreEnseignement(props, id);
  }

  get code(): string {
    return this.props.code;
  }
  get libelle(): string {
    return this.props.libelle;
  }
  get tutelleMinisterielle(): LibelleBilingue | undefined {
    return this.props.tutelleMinisterielle;
  }
  get rang(): number {
    return this.props.rang;
  }
  get description(): string | undefined {
    return this.props.description;
  }
}

interface TypeEnseignementProps {
  code: string;
  libelle: string;
  description?: string;
}

export class TypeEnseignement extends ReferentielEntity<TypeEnseignementProps> {
  static create(
    props: TypeEnseignementProps & ReferentielLifecycle,
    id: string,
  ): TypeEnseignement {
    return new TypeEnseignement(props, id);
  }

  get code(): string {
    return this.props.code;
  }
  get libelle(): string {
    return this.props.libelle;
  }
  get description(): string | undefined {
    return this.props.description;
  }
}
