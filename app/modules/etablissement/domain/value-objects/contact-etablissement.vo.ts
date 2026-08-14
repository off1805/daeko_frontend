import { EtablissementValidationError } from '~/modules/etablissement/domain/errors/etablissement.errors';

export interface ContactEtablissementProps {
  email?: string;
  telephone?: string;
  adressePostale?: string;
  siteWeb?: string;
}

/**
 * Value Object représentant les coordonnées de contact de l'établissement.
 */
export class ContactEtablissementVO {
  private readonly _email?: string;
  private readonly _telephone?: string;
  private readonly _adressePostale?: string;
  private readonly _siteWeb?: string;

  private constructor(props: ContactEtablissementProps) {
    this._email = props.email?.trim();
    this._telephone = props.telephone?.trim();
    this._adressePostale = props.adressePostale?.trim();
    this._siteWeb = props.siteWeb?.trim();

    this.valider();
  }

  public static create(props: ContactEtablissementProps = {}): ContactEtablissementVO {
    return new ContactEtablissementVO(props);
  }

  private valider(): void {
    if (this._email && !this.validerEmail(this._email)) {
      throw new EtablissementValidationError(`L'adresse email "${this._email}" est invalide.`);
    }

    if (this._telephone && !this.validerTelephone(this._telephone)) {
      throw new EtablissementValidationError(`Le numéro de téléphone "${this._telephone}" n'est pas dans un format valide.`);
    }
  }

  private validerEmail(email: string): boolean {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email);
  }

  private validerTelephone(tel: string): boolean {
    // Valide les formats de numéros téléphoniques standards (ex: (+237) 6XXXXXXXX ou 6XXXXXXXX)
    const regexTel = /^(\+?\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}$/;
    return regexTel.test(tel);
  }

  // Getters
  get email(): string | undefined {
    return this._email;
  }

  get telephone(): string | undefined {
    return this._telephone;
  }

  get adressePostale(): string | undefined {
    return this._adressePostale;
  }

  get siteWeb(): string | undefined {
    return this._siteWeb;
  }

  /**
   * Indique si les coordonnées de contact minimales sont saisies pour la complétude du compte.
   */
  get estRenseigne(): boolean {
    return Boolean(this._email && this._email.length > 0);
  }

  /**
   * Comparaison d'égalité par valeur.
   */
  public equals(other?: ContactEtablissementVO): boolean {
    if (!other) return false;
    return (
      this._email === other.email &&
      this._telephone === other.telephone &&
      this._adressePostale === other.adressePostale &&
      this._siteWeb === other.siteWeb
    );
  }

  /**
   * Crée une nouvelle instance modifiée immutablement.
   */
  public with(props: Partial<ContactEtablissementProps>): ContactEtablissementVO {
    return ContactEtablissementVO.create({
      email: props.email ?? this._email,
      telephone: props.telephone ?? this._telephone,
      adressePostale: props.adressePostale ?? this._adressePostale,
      siteWeb: props.siteWeb ?? this._siteWeb,
    });
  }
}