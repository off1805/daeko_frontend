import { ValueObject } from "~/shared/domain/value-object";

interface LibelleBilingueProps {
  fr: string;
  en?: string;
}

/**
 * Convention doc section 2 : tout libellé affichable sur document officiel
 * doit avoir sa contrepartie anglaise. Seules certaines colonnes du DDL
 * portent réellement une variante `_en` (cycle, niveau, filiere, serie,
 * matiere_referentiel, ordre_enseignement.tutelle_ministerielle) : ne pas
 * utiliser ce VO pour un libellé qui n'a pas de colonne `_en` en base.
 */
export class LibelleBilingue extends ValueObject<LibelleBilingueProps> {
  private constructor(props: LibelleBilingueProps) {
    super(props);
  }

  static create(fr: string, en?: string): LibelleBilingue {
    if (!fr.trim()) {
      throw new Error("Le libellé (français) est obligatoire.");
    }
    return new LibelleBilingue({ fr, en: en?.trim() ? en : undefined });
  }

  get fr(): string {
    return this.props.fr;
  }

  get en(): string | undefined {
    return this.props.en;
  }
}
