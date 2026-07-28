import { ValueObject } from "~/shared/domain/value-object";

interface IdentiteProps {
  nom: string;
  prenoms: string;
  sexe: "M" | "F";
  dateNaissance: string; // ISO AAAA-MM-JJ
  lieuNaissance?: string;
}


export class Identite extends ValueObject<IdentiteProps> {
  private constructor(props: IdentiteProps) {
    super(props);
  }

  static create(props: IdentiteProps): Identite {
    if (!props.nom.trim()) {
      throw new Error("Le nom est obligatoire.");
    }
    if (!props.prenoms.trim()) {
      throw new Error("Les prénoms sont obligatoires.");
    }
    if (!props.dateNaissance.trim()) {
      throw new Error("La date de naissance est obligatoire.");
    }
    return new Identite({
      nom: props.nom.trim(),
      prenoms: props.prenoms.trim(),
      sexe: props.sexe,
      dateNaissance: props.dateNaissance,
      lieuNaissance: props.lieuNaissance?.trim() || undefined,
    });
  }

  get nom(): string {
    return this.props.nom;
  }

  get prenoms(): string {
    return this.props.prenoms;
  }

  get sexe(): "M" | "F" {
    return this.props.sexe;
  }

  get dateNaissance(): string {
    return this.props.dateNaissance;
  }

  get lieuNaissance(): string | undefined {
    return this.props.lieuNaissance;
  }

  /** Pour l'affichage listes/recherche (§8, "insensible aux accents et à la casse"). */
  get nomComplet(): string {
    return `${this.props.nom} ${this.props.prenoms}`;
  }
}