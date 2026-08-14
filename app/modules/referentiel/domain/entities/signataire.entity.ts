import { Entity } from "~/shared/domain/entity";

interface SignataireProps {
  etablissementId: string;
  fonction: string; // ex: "Proviseur", "Censeur", "Surveillant général"
  nom: string;
  estPrincipal: boolean;
  signatureUrl?: string;
  /** null/undefined = signataire actif. Une date = désactivé depuis cette date (jamais supprimé, cf. RM-11). */
  dateFinFonction?: string | null;
}


export class Signataire extends Entity<SignataireProps> {
  private constructor(props: SignataireProps, id: string) {
    super(props, id);
  }

  static create(
    id: string,
    props: Omit<SignataireProps, "estPrincipal" | "dateFinFonction">
  ): Signataire {
    if (!props.fonction.trim()) {
      throw new Error("La fonction du signataire est obligatoire.");
    }
    if (!props.nom.trim()) {
      throw new Error("Le nom du signataire est obligatoire.");
    }
    return new Signataire(
      { ...props, estPrincipal: false, dateFinFonction: null },
      id
    );
  }

  /** Reconstruction depuis des données déjà persistées (usage réservé à l'infrastructure). */
  static reconstruct(id: string, props: SignataireProps): Signataire {
    return new Signataire(props, id);
  }

  get etablissementId(): string {
    return this.props.etablissementId;
  }

  get fonction(): string {
    return this.props.fonction;
  }

  get nom(): string {
    return this.props.nom;
  }

  get estPrincipal(): boolean {
    return this.props.estPrincipal;
  }

  get signatureUrl(): string | undefined {
    return this.props.signatureUrl;
  }

  get dateFinFonction(): string | null {
    return this.props.dateFinFonction ?? null;
  }

  get estActif(): boolean {
    return this.dateFinFonction === null;
  }

  /** Utilisé uniquement par Etablissement.designerSignatairePrincipal() pour la bascule atomique (RM-07). */
  avecStatutPrincipal(estPrincipal: boolean): Signataire {
    return new Signataire({ ...this.props, estPrincipal }, this.id);
  }

  /** CU-03, alternative A1 : désactivation, jamais suppression (RM-11). */
  desactiver(dateFinFonction: string): Signataire {
    if (!this.estActif) {
      throw new Error("Ce signataire est déjà désactivé.");
    }
    return new Signataire(
      { ...this.props, estPrincipal: false, dateFinFonction },
      this.id
    );
  }

  remplacerSignatureUrl(signatureUrl: string): Signataire {
    return new Signataire({ ...this.props, signatureUrl }, this.id);
  }
}