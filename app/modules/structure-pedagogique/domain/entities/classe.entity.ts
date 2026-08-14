import { Entity } from "~/shared/domain/entity";

// Doc section 3.8 — classe concrète (3ème A, Terminale C1...). Le
// rattachement niveau/série est immuable (SP-019) : une classe mal
// rattachée se désactive et se recrée, jamais de ré-affectation.

interface ClasseProps {
  configurationId: string;
  niveauActiveId: string;
  serieActiveId?: string;
  suffixe: string; // 'A', 'B', 'C1'...
  libelleComplet: string; // '3ème A' (généré)
  effectifPrevu?: number;
  salle?: string;
  enseignantPrincipalId?: string; // référence LOGIQUE module Personnes (sans FK)
  actif: boolean;
  dateCreation: string;
  dateModification: string;
  creePar: string;
  modifiePar: string;
}

export class Classe extends Entity<ClasseProps> {
  static create(props: ClasseProps, id: string): Classe {
    return new Classe(props, id);
  }

  get configurationId(): string {
    return this.props.configurationId;
  }
  get niveauActiveId(): string {
    return this.props.niveauActiveId;
  }
  get serieActiveId(): string | undefined {
    return this.props.serieActiveId;
  }
  get suffixe(): string {
    return this.props.suffixe;
  }
  get libelleComplet(): string {
    return this.props.libelleComplet;
  }
  get effectifPrevu(): number | undefined {
    return this.props.effectifPrevu;
  }
  get salle(): string | undefined {
    return this.props.salle;
  }
  get enseignantPrincipalId(): string | undefined {
    return this.props.enseignantPrincipalId;
  }
  get actif(): boolean {
    return this.props.actif;
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
