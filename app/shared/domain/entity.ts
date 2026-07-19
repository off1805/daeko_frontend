export abstract class Entity<Props> {
  protected readonly props: Props;
  private readonly _id: string;

  protected constructor(props: Props, id: string) {
    this.props = props;
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  /** Expose l'état interne pour les repositories (reconstruction, merge de mise à jour). */
  toProps(): Readonly<Props> {
    return this.props;
  }

  equals(entity?: Entity<Props>): boolean {
    if (!entity) return false;
    if (this === entity) return true;
    return this._id === entity._id;
  }
}
