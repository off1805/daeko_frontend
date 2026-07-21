/**
 * Interface définissant les propriétés de traçabilité et d'audit communes.
 */
export interface EntityMetadataProps {
  id: string;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Classe abstraite de base pour toutes les entités du domaine Établissement.
 * Garantit l'isolation multi-tenant et la traçabilité des modifications.
 */
export abstract class BaseDomainEntity<TProps> {
  protected readonly _id: string;
  protected readonly _tenantId: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;
  protected _createdBy?: string;
  protected _updatedBy?: string;
  protected props: TProps;

  constructor(
    props: TProps,
    metadata: EntityMetadataProps
  ) {
    this._id = metadata.id;
    this._tenantId = metadata.tenantId;
    this._createdAt = metadata.createdAt || new Date();
    this._updatedAt = metadata.updatedAt || new Date();
    this._createdBy = metadata.createdBy;
    this._updatedBy = metadata.updatedBy;
    this.props = props;
  }

  // Getters d'accès
  get id(): string {
    return this._id;
  }

  get tenantId(): string {
    return this._tenantId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  get createdBy(): string | undefined {
    return this._createdBy;
  }

  get updatedBy(): string | undefined {
    return this._updatedBy;
  }

  /**
   * Met à jour la date de modification et l'auteur du changement.
   */
  protected touch(auteurId?: string): void {
    this._updatedAt = new Date();
    if (auteurId) {
      this._updatedBy = auteurId;
    }
  }

  /**
   * Compare la référence de deux entités par leur ID unique.
   */
  public equals(other?: BaseDomainEntity<TProps>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (this === other) {
      return true;
    }
    return this._id === other._id;
  }
}