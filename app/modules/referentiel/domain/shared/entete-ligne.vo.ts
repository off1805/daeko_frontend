import { ValueObject } from "~/shared/domain/value-object";

interface EnteteLigneProps {
  ordre: number;
  texteFr?: string;
  texteEn?: string;
}


export class EnteteLigne extends ValueObject<EnteteLigneProps> {
  private constructor(props: EnteteLigneProps) {
    super(props);
  }

  static create(props: EnteteLigneProps): EnteteLigne {
    if (!props.texteFr?.trim() && !props.texteEn?.trim()) {
      throw new Error(
        "Une ligne d'en-tête doit avoir au moins une version, française ou anglaise."
      );
    }
    if (props.ordre < 0) {
      throw new Error("L'ordre d'une ligne d'en-tête ne peut pas être négatif.");
    }
    return new EnteteLigne({
      ordre: props.ordre,
      texteFr: props.texteFr?.trim() ? props.texteFr.trim() : undefined,
      texteEn: props.texteEn?.trim() ? props.texteEn.trim() : undefined,
    });
  }

  get ordre(): number {
    return this.props.ordre;
  }

  get texteFr(): string | undefined {
    return this.props.texteFr;
  }

  get texteEn(): string | undefined {
    return this.props.texteEn;
  }

  get possedeVersionFrancaise(): boolean {
    return !!this.props.texteFr;
  }

  get possedeVersionAnglaise(): boolean {
    return !!this.props.texteEn;
  }

  /** Pour le glisser-déposer côté présentation (§7.2, éditeur d'en-tête). */
  avecOrdre(nouvelOrdre: number): EnteteLigne {
    return EnteteLigne.create({ ...this.props, ordre: nouvelOrdre });
  }
}