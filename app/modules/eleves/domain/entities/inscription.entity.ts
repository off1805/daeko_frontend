import { Entity } from "~/shared/domain/entity";
import type { EtatInscription } from "../shared/etat-inscription";
import { MutationInscription } from "./mutation-inscription.entity";
import {
  InscriptionNonActiveError,
  MotifObligatoireError,
  MutationVersClasseOrigineError,
} from "../errors/inscription.errors";

interface InscriptionProps {
  etablissementId: string;
  eleveId: string;
  classeId: string;
  anneeAcademiqueId: string;
  numeroOrdre: number;
  etat: EtatInscription;
  dateInscription: string;
  dateCloture?: string | null;
  motifCloture?: string | null;
  mutations: MutationInscription[];
  dateCreation: string;
  dateModification: string;
}


export class Inscription extends Entity<InscriptionProps> {
  private constructor(props: InscriptionProps, id: string) {
    super(props, id);
  }

  
  static create(
    id: string,
    props: {
      etablissementId: string;
      eleveId: string;
      classeId: string;
      anneeAcademiqueId: string;
      numeroOrdre: number;
      maintenant: string;
    }
  ): Inscription {
    return new Inscription(
      {
        ...props,
        etat: "ACTIVE",
        dateInscription: props.maintenant,
        dateCloture: null,
        motifCloture: null,
        mutations: [],
        dateCreation: props.maintenant,
        dateModification: props.maintenant,
      },
      id
    );
  }

  /** Reconstruction depuis des données déjà persistées (usage réservé à l'infrastructure). */
  static reconstruct(id: string, props: InscriptionProps): Inscription {
    return new Inscription(props, id);
  }

  // --- Lecture -----------------------------------------------------------

  get etablissementId(): string {
    return this.props.etablissementId;
  }

  get eleveId(): string {
    return this.props.eleveId;
  }

  get classeId(): string {
    return this.props.classeId;
  }

  get anneeAcademiqueId(): string {
    return this.props.anneeAcademiqueId;
  }

  get numeroOrdre(): number {
    return this.props.numeroOrdre;
  }

  get etat(): EtatInscription {
    return this.props.etat;
  }

  get estActive(): boolean {
    return this.props.etat === "ACTIVE";
  }

  get dateInscription(): string {
    return this.props.dateInscription;
  }

  get dateCloture(): string | null {
    return this.props.dateCloture ?? null;
  }

  get motifCloture(): string | null {
    return this.props.motifCloture ?? null;
  }

  get mutations(): readonly MutationInscription[] {
    return this.props.mutations;
  }

  // --- Mutation (CU-04, RM-E-08, ELV-008/012) ------------------------------

  /**
   * @param nouveauNumeroOrdre Déjà calculé par NumeroOrdreService pour la classe cible.
   */
  ajusterNumeroOrdre(nouveauNumero: number, maintenant: string): Inscription {
    return this.copierAvec({ numeroOrdre: nouveauNumero }, maintenant);
  }
  muter(
    classeCibleId: string,
    nouveauNumeroOrdre: number,
    motif: string,
    acteurId: string,
    mutationId: string,
    maintenant: string
  ): Inscription {
    this.garantirActive();
    if (!motif.trim()) throw new MotifObligatoireError();
    if (classeCibleId === this.props.classeId) {
      throw new MutationVersClasseOrigineError();
    }

    const mutation = MutationInscription.create(
      mutationId,
      {
        inscriptionId: this.id,
        classeOrigineId: this.props.classeId,
        classeArriveeId: classeCibleId,
        numeroOrdreOrigine: this.props.numeroOrdre,
        numeroOrdreArrivee: nouveauNumeroOrdre,
        motif,
        acteurId,
      },
      maintenant
    );

    return this.copierAvec(
      {
        classeId: classeCibleId,
        numeroOrdre: nouveauNumeroOrdre,
        mutations: [...this.props.mutations, mutation],
      },
      maintenant
    );
  }

  // --- Clôture (CU-05, RM-E-09, ELV-008/013) ------------------------------

  cloturer(
    type: "ABANDON" | "EXCLUSION",
    motif: string,
    maintenant: string
  ): Inscription {
    this.garantirActive();
    if (!motif.trim()) throw new MotifObligatoireError();

    return this.copierAvec(
      {
        etat: type === "ABANDON" ? "ABANDONNEE" : "EXCLUE",
        dateCloture: maintenant,
        motifCloture: motif,
      },
      maintenant
    );
  }


  reactiver(numeroOrdre: number, maintenant: string): Inscription {
    if (this.props.etat === "ACTIVE") {
      throw new Error("Cette inscription est déjà active.");
    }
    return this.copierAvec(
      { etat: "ACTIVE", numeroOrdre, dateCloture: null, motifCloture: null },
      maintenant
    );
  }

  /** §4.6 : réaction à la clôture de l'année académique — jamais appelé directement par un utilisateur. */
  cloturerParFinAnnee(maintenant: string): Inscription {
    if (this.props.etat !== "ACTIVE") {
      return this; // idempotent : seules les inscriptions ACTIVE basculent en ACHEVEE
    }
    return this.copierAvec({ etat: "ACHEVEE" }, maintenant);
  }

  private garantirActive(): void {
    if (this.props.etat !== "ACTIVE") {
      throw new InscriptionNonActiveError(this.props.etat);
    }
  }

  private copierAvec(changements: Partial<InscriptionProps>, maintenant: string): Inscription {
    return new Inscription(
      { ...this.props, ...changements, dateModification: maintenant },
      this.id
    );
  }
}