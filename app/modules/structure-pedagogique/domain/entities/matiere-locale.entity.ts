import { Entity } from "~/shared/domain/entity";
import type {
  DomaineMatiere,
  TypeMatiere,
} from "~/modules/referentiel/domain/entities/catalogue-matieres.entity";
import type { EtatElementLocal } from "~/modules/structure-pedagogique/domain/shared/etats";

// Doc section 3.3 — matière locale : rattachée à UNE branche, invisible
// hors de l'école, append-only (dépréciation avec motif, jamais de
// suppression). Réutilise les types du référentiel pour un affichage
// homogène (doc 3.3 : "garantir un affichage homogène").

interface MatiereLocaleProps {
  brancheId: string;
  code: string;
  libelle: string;
  libelleCourt?: string;
  libelleEn?: string;
  domaine: DomaineMatiere;
  typeMatiere: TypeMatiere;
  baremeParDefaut: number;
  etat: EtatElementLocal;
  motifDepreciation: string | null;
  dateCreation: string;
  dateModification: string;
  creePar: string;
  modifiePar: string;
}

export class MatiereLocale extends Entity<MatiereLocaleProps> {
  static create(props: MatiereLocaleProps, id: string): MatiereLocale {
    return new MatiereLocale(props, id);
  }

  get brancheId(): string {
    return this.props.brancheId;
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
  get libelleEn(): string | undefined {
    return this.props.libelleEn;
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
  get etat(): EtatElementLocal {
    return this.props.etat;
  }
  get motifDepreciation(): string | null {
    return this.props.motifDepreciation;
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
