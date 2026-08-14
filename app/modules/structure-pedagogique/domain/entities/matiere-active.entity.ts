import { Entity } from "~/shared/domain/entity";

// Doc section 3.7 — matière active : LE cœur du module. Le coefficient ici
// (jamais celui du référentiel) est celui que le module Évaluation & Notes
// utilisera pour tous les calculs de moyennes (règle cardinale, doc 3.7).
// Polymorphisme strict : exactement une source (matiereReferentielId XOR
// matiereLocaleId), doc SP-008.

interface MatiereActiveProps {
  niveauActiveId: string;
  serieActiveId?: string; // absent = vaut pour tout le niveau
  matiereReferentielId?: string;
  matiereLocaleId?: string;
  coefficient: number;
  bareme?: number; // absent = barème par défaut
  estObligatoire: boolean;
  dateCreation: string;
  dateModification: string;
  creePar: string;
  modifiePar: string;
}

export class MatiereActive extends Entity<MatiereActiveProps> {
  static create(props: MatiereActiveProps, id: string): MatiereActive {
    return new MatiereActive(props, id);
  }

  get niveauActiveId(): string {
    return this.props.niveauActiveId;
  }
  get serieActiveId(): string | undefined {
    return this.props.serieActiveId;
  }
  get matiereReferentielId(): string | undefined {
    return this.props.matiereReferentielId;
  }
  get matiereLocaleId(): string | undefined {
    return this.props.matiereLocaleId;
  }
  get coefficient(): number {
    return this.props.coefficient;
  }
  get bareme(): number | undefined {
    return this.props.bareme;
  }
  get estObligatoire(): boolean {
    return this.props.estObligatoire;
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
