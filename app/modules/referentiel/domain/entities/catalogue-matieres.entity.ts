import {
  ReferentielEntity,
  type ReferentielLifecycle,
} from "~/modules/referentiel/domain/shared/referentiel-entity";
import { LibelleBilingue } from "~/modules/referentiel/domain/shared/libelle-bilingue.vo";

// Doc section 3.6 — catalogue des matières : matiere_referentiel et
// matiere_referentiel_niveau (compatibilité + coefficient suggéré, fusionnées
// dans une seule table par décision actée en 1.1 — ne pas les scinder).

export type DomaineMatiere =
  | "SCIENCES"
  | "LETTRES"
  | "LANGUES"
  | "SCIENCES_HUMAINES"
  | "ARTS"
  | "SPORT"
  | "TECHNIQUE"
  | "TRANSVERSAL";

export type TypeMatiere =
  | "FONDAMENTALE"
  | "SECONDAIRE"
  | "OPTIONNELLE"
  | "TRANSVERSALE";

interface MatiereReferentielProps {
  sousSystemeId: string;
  code: string;
  libelle: LibelleBilingue;
  libelleCourt?: string;
  domaine: DomaineMatiere;
  typeMatiere: TypeMatiere;
  baremeParDefaut: number;
  description?: string;
}

export class MatiereReferentiel extends ReferentielEntity<MatiereReferentielProps> {
  static create(
    props: MatiereReferentielProps & ReferentielLifecycle,
    id: string,
  ): MatiereReferentiel {
    return new MatiereReferentiel(props, id);
  }

  get sousSystemeId(): string {
    return this.props.sousSystemeId;
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
  get domaine(): DomaineMatiere {
    return this.props.domaine;
  }
  get typeMatiere(): TypeMatiere {
    return this.props.typeMatiere;
  }
  get baremeParDefaut(): number {
    return this.props.baremeParDefaut;
  }
  get description(): string | undefined {
    return this.props.description;
  }
}

interface MatiereReferentielNiveauProps {
  matiereReferentielId: string;
  niveauId: string;
  serieId?: string; // absent = toutes séries de ce niveau
  estObligatoire: boolean;
  coefficientSuggere?: number;
  sourceCoefficient?: string;
  baremeSpecifique?: number;
  description?: string;
}

export class MatiereReferentielNiveau extends ReferentielEntity<MatiereReferentielNiveauProps> {
  static create(
    props: MatiereReferentielNiveauProps & ReferentielLifecycle,
    id: string,
  ): MatiereReferentielNiveau {
    return new MatiereReferentielNiveau(props, id);
  }

  get matiereReferentielId(): string {
    return this.props.matiereReferentielId;
  }
  get niveauId(): string {
    return this.props.niveauId;
  }
  get serieId(): string | undefined {
    return this.props.serieId;
  }
  get estObligatoire(): boolean {
    return this.props.estObligatoire;
  }
  get coefficientSuggere(): number | undefined {
    return this.props.coefficientSuggere;
  }
  get sourceCoefficient(): string | undefined {
    return this.props.sourceCoefficient;
  }
  get baremeSpecifique(): number | undefined {
    return this.props.baremeSpecifique;
  }
  get description(): string | undefined {
    return this.props.description;
  }
}
