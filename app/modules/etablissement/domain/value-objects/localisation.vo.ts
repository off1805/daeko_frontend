import { EtablissementValidationError } from '~/modules/etablissement/domain/errors/etablissement.errors';

export interface LocalisationProps {
  regionCode: string;
  departementCode: string;
  arrondissementCode: string;
  ville: string;
}

/**
 * Value Object représentant la localisation administrative officielle au Cameroun (RM-04, F-03).
 * Garantit l'immutabilité et la validité des trois niveaux territoriaux.
 */
export class LocalisationVO {
  private readonly _regionCode: string;
  private readonly _departementCode: string;
  private readonly _arrondissementCode: string;
  private readonly _ville: string;

  private constructor(props: LocalisationProps) {
    this._regionCode = props.regionCode.trim();
    this._departementCode = props.departementCode.trim();
    this._arrondissementCode = props.arrondissementCode.trim();
    this._ville = props.ville.trim();

    this.valider();
  }

  public static create(props: LocalisationProps): LocalisationVO {
    return new LocalisationVO(props);
  }

  private valider(): void {
    if (!this._regionCode) {
      throw new EtablissementValidationError('Le code de la région est obligatoire.');
    }
    if (!this._departementCode) {
      throw new EtablissementValidationError('Le code du département est obligatoire.');
    }
    if (!this._arrondissementCode) {
      throw new EtablissementValidationError('Le code de l\'arrondissement est obligatoire.');
    }
    if (!this._ville) {
      throw new EtablissementValidationError('Le nom de la ville est obligatoire.');
    }
  }

  // Getters
  get regionCode(): string {
    return this._regionCode;
  }

  get departementCode(): string {
    return this._departementCode;
  }

  get arrondissementCode(): string {
    return this._arrondissementCode;
  }

  get ville(): string {
    return this._ville;
  }

  /**
   * Comparaison d'égalité par valeur.
   */
  public equals(other?: LocalisationVO): boolean {
    if (!other) return false;
    return (
      this._regionCode === other.regionCode &&
      this._departementCode === other.departementCode &&
      this._arrondissementCode === other.arrondissementCode &&
      this._ville.toLowerCase() === other.ville.toLowerCase()
    );
  }

  /**
   * Retourne un nouvel objet immutable avec les propriétés modifiées.
   */
  public with(props: Partial<LocalisationProps>): LocalisationVO {
    return LocalisationVO.create({
      regionCode: props.regionCode ?? this._regionCode,
      departementCode: props.departementCode ?? this._departementCode,
      arrondissementCode: props.arrondissementCode ?? this._arrondissementCode,
      ville: props.ville ?? this._ville,
    });
  }
}