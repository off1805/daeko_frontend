import { Entity } from "~/shared/domain/entity";
import type { EtatReferentiel } from "~/modules/referentiel/domain/shared/etat-referentiel";

/**
 * Bloc de colonnes communes à toute table du module (doc section 3.2) :
 * cycle de vie append-only (ACTIVE -> DEPRECATED, jamais de suppression)
 * et traçabilité. Reproduit ici comme partie commune de toute entité du
 * référentiel plutôt que dupliqué dans chaque entité.
 */
export interface ReferentielLifecycle {
  etat: EtatReferentiel;
  dateEntreeVigueur: string; // date ISO (AAAA-MM-JJ)
  dateDepreciation: string | null;
  motifDepreciation: string | null;
  dateCreation: string; // horodatage ISO
  dateModification: string; // horodatage ISO
  creePar: string;
  modifiePar: string;
}

export abstract class ReferentielEntity<Props> extends Entity<
  Props & ReferentielLifecycle
> {
  protected constructor(props: Props & ReferentielLifecycle, id: string) {
    super(props, id);
  }

  get etat(): EtatReferentiel {
    return this.props.etat;
  }

  get estActive(): boolean {
    return this.props.etat === "ACTIVE";
  }

  get dateEntreeVigueur(): string {
    return this.props.dateEntreeVigueur;
  }

  get dateDepreciation(): string | null {
    return this.props.dateDepreciation;
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
