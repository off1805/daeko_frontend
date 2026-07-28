import { Entity } from "~/shared/domain/entity";

interface MutationInscriptionProps {
  inscriptionId: string;
  classeOrigineId: string;
  classeArriveeId: string;
  numeroOrdreOrigine: number;
  numeroOrdreArrivee: number;
  dateMutation: string; // ISO AAAA-MM-JJ
  motif: string;
  acteurId: string;
}


export class MutationInscription extends Entity<MutationInscriptionProps> {
  private constructor(props: MutationInscriptionProps, id: string) {
    super(props, id);
  }

  static create(
    id: string,
    props: Omit<MutationInscriptionProps, "dateMutation"> & { dateMutation?: string },
    maintenant: string
  ): MutationInscription {
    if (!props.motif.trim()) {
      throw new Error("Le motif de la mutation est obligatoire.");
    }
    return new MutationInscription(
      { ...props, dateMutation: props.dateMutation ?? maintenant },
      id
    );
  }

  /** Reconstruction depuis des données déjà persistées (usage réservé à l'infrastructure). */
  static reconstruct(id: string, props: MutationInscriptionProps): MutationInscription {
    return new MutationInscription(props, id);
  }

  get inscriptionId(): string {
    return this.props.inscriptionId;
  }

  get classeOrigineId(): string {
    return this.props.classeOrigineId;
  }

  get classeArriveeId(): string {
    return this.props.classeArriveeId;
  }

  get numeroOrdreOrigine(): number {
    return this.props.numeroOrdreOrigine;
  }

  get numeroOrdreArrivee(): number {
    return this.props.numeroOrdreArrivee;
  }

  get dateMutation(): string {
    return this.props.dateMutation;
  }

  get motif(): string {
    return this.props.motif;
  }

  get acteurId(): string {
    return this.props.acteurId;
  }
}