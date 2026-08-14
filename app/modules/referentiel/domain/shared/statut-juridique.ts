import { ValueObject } from "~/shared/domain/value-object";

interface StatutJuridiqueProps {
  code: string; // ex: "PUBLIC", "PRIVE_LAIC", "PRIVE_CONFESSIONNEL_CATHOLIQUE"...
}


export class StatutJuridique extends ValueObject<StatutJuridiqueProps> {
  private constructor(props: StatutJuridiqueProps) {
    super(props);
  }

  static create(code: string): StatutJuridique {
    if (!code.trim()) {
      throw new Error("Le statut juridique est obligatoire.");
    }
    return new StatutJuridique({ code: code.trim().toUpperCase() });
  }

  get code(): string {
    return this.props.code;
  }

 
  get requiertAgrement(): boolean {
    return this.props.code !== STATUTS_JURIDIQUES_CONNUS.PUBLIC;
  }
}

/** Valeurs connues à ce jour — pas figées, juste des raccourcis pratiques. */
export const STATUTS_JURIDIQUES_CONNUS = {
  PUBLIC: "PUBLIC",
  PRIVE_LAIC: "PRIVE_LAIC",
  PRIVE_CONFESSIONNEL_CATHOLIQUE: "PRIVE_CONFESSIONNEL_CATHOLIQUE",
  PRIVE_CONFESSIONNEL_PROTESTANT: "PRIVE_CONFESSIONNEL_PROTESTANT",
  PRIVE_CONFESSIONNEL_ISLAMIQUE: "PRIVE_CONFESSIONNEL_ISLAMIQUE",
} as const;