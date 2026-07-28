import { Entity } from "~/shared/domain/entity";
import type { LienParente } from "../shared/lien-parente";

interface TuteurProps {
  eleveId: string;
  nom: string;
  lienParente: LienParente;
  telephone: string;
  profession?: string;
  adresse?: string;
  estContactPrincipal: boolean;
}


export class Tuteur extends Entity<TuteurProps> {
  private constructor(props: TuteurProps, id: string) {
    super(props, id);
  }

  static create(
    id: string,
    props: Omit<TuteurProps, "estContactPrincipal">
  ): Tuteur {
    if (!props.nom.trim()) {
      throw new Error("Le nom du tuteur est obligatoire.");
    }
    if (!props.telephone.trim()) {
      throw new Error("Le téléphone du tuteur est obligatoire.");
    }
    return new Tuteur({ ...props, estContactPrincipal: false }, id);
  }

  /** Reconstruction depuis des données déjà persistées (usage réservé à l'infrastructure). */
  static reconstruct(id: string, props: TuteurProps): Tuteur {
    return new Tuteur(props, id);
  }

  get eleveId(): string {
    return this.props.eleveId;
  }

  get nom(): string {
    return this.props.nom;
  }

  get lienParente(): LienParente {
    return this.props.lienParente;
  }

  get telephone(): string {
    return this.props.telephone;
  }

  get profession(): string | undefined {
    return this.props.profession;
  }

  get adresse(): string | undefined {
    return this.props.adresse;
  }

  get estContactPrincipal(): boolean {
    return this.props.estContactPrincipal;
  }

  /** Utilisé uniquement par Eleve.definirTuteurPrincipal() pour la bascule atomique. */
  avecStatutPrincipal(estContactPrincipal: boolean): Tuteur {
    return new Tuteur({ ...this.props, estContactPrincipal }, this.id);
  }

  /** PATCH /tuteurs/{id} : coordonnées modifiables, jamais le lien de parenté par ce chemin (non précisé comme modifiable). */
  modifierCoordonnees(changements: {
    nom?: string;
    telephone?: string;
    profession?: string;
    adresse?: string;
  }): Tuteur {
    if (changements.telephone !== undefined && !changements.telephone.trim()) {
      throw new Error("Le téléphone du tuteur ne peut pas être vide.");
    }
    return new Tuteur({ ...this.props, ...changements }, this.id);
  }
}