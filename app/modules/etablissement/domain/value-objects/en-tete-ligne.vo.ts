import { LigneBilingueIncompleteError } from '~/modules/etablissement/domain/errors/etablissement.errors';

export type ModeEnTete = 'SIMPLE' | 'BILINGUE';

export interface LigneEnTeteProps {
  ordre: number;
  texteFr: string;
  texteEn?: string;
}

/**
 * Value Object représentant une ligne de l'en-tête officiel (F-05).
 * Gère le support du bilinguisme (Français / Anglais) selon la règle RM-06.
 */
export class LigneEnTeteVO {
  private readonly _ordre: number;
  private readonly _texteFr: string;
  private readonly _texteEn?: string;

  private constructor(props: LigneEnTeteProps, mode: ModeEnTete = 'SIMPLE') {
    this._ordre = props.ordre;
    this._texteFr = props.texteFr.trim();
    this._texteEn = props.texteEn?.trim();

    this.valider(mode);
  }

  public static create(props: LigneEnTeteProps, mode: ModeEnTete = 'SIMPLE'): LigneEnTeteVO {
    return new LigneEnTeteVO(props, mode);
  }

  private valider(mode: ModeEnTete): void {
    if (this._ordre < 1) {
      throw new Error('L\'ordre d\'une ligne d\'en-tête doit être un entier strictement positif.');
    }

    if (!this._texteFr) {
      throw new Error(`La ligne ${this._ordre} de l'en-tête doit contenir un texte en français.`);
    }

    // RM-06 : En mode bilingue, la version anglaise est strictement obligatoire
    if (mode === 'BILINGUE' && (!this._texteEn || this._texteEn === '')) {
      throw new LigneBilingueIncompleteError(this._ordre);
    }
  }

  // Getters
  get ordre(): number {
    return this._ordre;
  }

  get texteFr(): string {
    return this._texteFr;
  }

  get texteEn(): string | undefined {
    return this._texteEn;
  }

  /**
   * Indique si la ligne est complète pour le mode d'affichage demandé.
   */
  public estComplete(mode: ModeEnTete): boolean {
    if (!this._texteFr) return false;
    if (mode === 'BILINGUE' && !this._texteEn) return false;
    return true;
  }

  /**
   * Comparaison d'égalité par valeur.
   */
  public equals(other?: LigneEnTeteVO): boolean {
    if (!other) return false;
    return (
      this._ordre === other.ordre &&
      this._texteFr === other.texteFr &&
      this._texteEn === other.texteEn
    );
  }
}