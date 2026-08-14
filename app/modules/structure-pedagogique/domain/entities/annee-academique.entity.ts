import { Entity } from "~/shared/domain/entity";
import type { EtatAnnee } from "~/modules/structure-pedagogique/domain/shared/etats";

// Doc section 3.4 — année académique. Une seule EN_COURS à la fois (index
// partiel côté DDL, appliqué ici dans le repository).

interface AnneeAcademiqueProps {
  libelle: string; // ex: '2025-2026'
  dateDebut: string;
  dateFin: string;
  etat: EtatAnnee;
  dateDemarrage: string | null;
  dateCloture: string | null;
  dateCreation: string;
  dateModification: string;
  creePar: string;
  modifiePar: string;
}

export class AnneeAcademique extends Entity<AnneeAcademiqueProps> {
  static create(props: AnneeAcademiqueProps, id: string): AnneeAcademique {
    return new AnneeAcademique(props, id);
  }

  get libelle(): string {
    return this.props.libelle;
  }
  get dateDebut(): string {
    return this.props.dateDebut;
  }
  get dateFin(): string {
    return this.props.dateFin;
  }
  get etat(): EtatAnnee {
    return this.props.etat;
  }
  get dateDemarrage(): string | null {
    return this.props.dateDemarrage;
  }
  get dateCloture(): string | null {
    return this.props.dateCloture;
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
