import { BaseDomainEntity } from '~/modules/etablissement/domain/shared/etablissement-entity';
import type { EntityMetadataProps } from '~/modules/etablissement/domain/shared/etablissement-entity';
import type { ModeEnTete } from '~/modules/etablissement/domain/value-objects/en-tete-ligne.vo';
import { LigneEnTeteVO } from '~/modules/etablissement/domain/value-objects/en-tete-ligne.vo';
import { LigneBilingueIncompleteError, EtablissementValidationError } from '~/modules/etablissement/domain/errors/etablissement.errors';

export interface EnTeteProps {
  mode: ModeEnTete;
  lignes: LigneEnTeteVO[];
  deviseSpecifique?: string;
}

export class EnTeteOfficiel extends BaseDomainEntity<EnTeteProps> {

  private constructor(props: EnTeteProps, metadata: EntityMetadataProps) {
    super(props, metadata);
    this.valider();
  }

  public static create(props: EnTeteProps, metadata: EntityMetadataProps): EnTeteOfficiel {
    return new EnTeteOfficiel(props, metadata);
  }

  private valider(): void {
    if (!this.props.lignes || this.props.lignes.length === 0) {
      throw new EtablissementValidationError('L\'en-tête officiel doit contenir au moins une ligne.');
    }

    // RM-06 : En mode bilingue, chaque ligne doit être valide dans les deux langues
    if (this.props.mode === 'BILINGUE') {
      for (const ligne of this.props.lignes) {
        if (!ligne.estComplete('BILINGUE')) {
          throw new LigneBilingueIncompleteError(ligne.ordre);
        }
      }
    }
  }

  // Getters
  get mode(): ModeEnTete { return this.props.mode; }
  get lignes(): LigneEnTeteVO[] { return [...this.props.lignes].sort((a, b) => a.ordre - b.ordre); }
  get deviseSpecifique(): string | undefined { return this.props.deviseSpecifique; }

  // Actions
  public basculerMode(nouveauMode: ModeEnTete, auteurId?: string): void {
    this.props.mode = nouveauMode;
    this.valider();
    this.touch(auteurId);
  }

  public modifierLignes(nouvellesLignes: LigneEnTeteVO[], auteurId?: string): void {
    this.props.lignes = nouvellesLignes;
    this.valider();
    this.touch(auteurId);
  }

  public estValide(): boolean {
    try {
      this.valider();
      return true;
    } catch {
      return false;
    }
  }
}