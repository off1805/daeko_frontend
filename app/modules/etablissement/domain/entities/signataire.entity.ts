import { BaseDomainEntity } from '~/modules/etablissement/domain/shared/etablissement-entity';
import type { EntityMetadataProps } from '~/modules/etablissement/domain/shared/etablissement-entity';
import { EtablissementValidationError } from '~/modules/etablissement/domain/errors/etablissement.errors';

export interface SignataireProps {
  nom: string;
  prenom?: string;
  fonction: string; // Proviseur, Censeur, Principal, Directeur, etc.
  estPrincipal: boolean;
  signatureImageUrl?: string;
  estActif: boolean;
  dateFinFonction?: Date;
}

export class Signataire extends BaseDomainEntity<SignataireProps> {

  private constructor(props: SignataireProps, metadata: EntityMetadataProps) {
    super(props, metadata);
    this.valider();
  }

  public static create(
    props: Omit<SignataireProps, 'estActif'> & { estActif?: boolean },
    metadata: EntityMetadataProps
  ): Signataire {
    return new Signataire(
      {
        ...props,
        estActif: props.estActif ?? true
      },
      metadata
    );
  }

  private valider(): void {
    if (!this.props.nom || this.props.nom.trim() === '') {
      throw new EtablissementValidationError('Le nom du signataire est obligatoire.');
    }
    if (!this.props.fonction || this.props.fonction.trim() === '') {
      throw new EtablissementValidationError('La fonction du signataire est obligatoire.');
    }
  }

  // Getters
  get nom(): string { return this.props.nom; }
  get prenom(): string | undefined { return this.props.prenom; }
  get nomComplet(): string { return this.props.prenom ? `${this.props.prenom} ${this.props.nom}` : this.props.nom; }
  get fonction(): string { return this.props.fonction; }
  get estPrincipal(): boolean { return this.props.estPrincipal; }
  get signatureImageUrl(): string | undefined { return this.props.signatureImageUrl; }
  get estActif(): boolean { return this.props.estActif; }
  get dateFinFonction(): Date | undefined { return this.props.dateFinFonction; }

  // Actions
  public definirCommePrincipal(auteurId?: string): void {
    this.props.estPrincipal = true;
    this.props.estActif = true;
    this.touch(auteurId);
  }

  public retirerPrincipal(auteurId?: string): void {
    this.props.estPrincipal = false;
    this.touch(auteurId);
  }

  public desactiver(dateFin?: Date, auteurId?: string): void {
    this.props.estActif = false;
    this.props.estPrincipal = false;
    this.props.dateFinFonction = dateFin ?? new Date();
    this.touch(auteurId);
  }

  public attacherSignatureImage(imageUrl: string, auteurId?: string): void {
    this.props.signatureImageUrl = imageUrl;
    this.touch(auteurId);
  }
}