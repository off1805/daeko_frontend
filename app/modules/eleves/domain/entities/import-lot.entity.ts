import { Entity } from "~/shared/domain/entity";
import type { StatutImportLot } from "../shared/statut-import-lot";
import {
  CorrespondanceIncompleteError,
  TransitionImportInvalideError,
} from "../errors/import.errors";

/**
 * ⚠️ Hypothèse à confirmer : champs obligatoires déduits de RM-E-03
 * (matricule) et RM-E-04 (identité + un tuteur avec téléphone) — le
 * dossier technique ne les énumère pas explicitement pour l'import.
 */
export const CHAMPS_OBLIGATOIRES_IMPORT = [
  "matricule",
  "nom",
  "prenoms",
  "sexe",
  "date_naissance",
  "tuteur_nom",
  "tuteur_telephone",
] as const;

interface ImportLotProps {
  etablissementId: string;
  fichierNom: string;
  statut: StatutImportLot;
  /** Mapping colonne du fichier -> champ de la plateforme (§2.5). Vide tant que non validée. */
  correspondanceColonnes: Record<string, string>;
  classeCibleId?: string;
  nbLignes: number;
  nbCreees: number;
  nbRejetees: number;
  creePar: string;
  dateCreation: string;
}


export class ImportLot extends Entity<ImportLotProps> {
  private constructor(props: ImportLotProps, id: string) {
    super(props, id);
  }

  /** POST /imports : après téléversement du fichier, avant toute validation de correspondance. */
  static televerser(
    id: string,
    props: {
      etablissementId: string;
      fichierNom: string;
      nbLignes: number;
      classeCibleId?: string;
      creePar: string;
      maintenant: string;
    }
  ): ImportLot {
    return new ImportLot(
      {
        ...props,
        statut: "TELEVERSE",
        correspondanceColonnes: {},
        nbCreees: 0,
        nbRejetees: 0,
        dateCreation: props.maintenant,
      },
      id
    );
  }

  /** Reconstruction depuis des données déjà persistées (usage réservé à l'infrastructure). */
  static reconstruct(id: string, props: ImportLotProps): ImportLot {
    return new ImportLot(props, id);
  }

  // --- Lecture -------------------------------------------------------

  get etablissementId(): string {
    return this.props.etablissementId;
  }

  get fichierNom(): string {
    return this.props.fichierNom;
  }

  get statut(): StatutImportLot {
    return this.props.statut;
  }

  get correspondanceColonnes(): Readonly<Record<string, string>> {
    return this.props.correspondanceColonnes;
  }

  get classeCibleId(): string | undefined {
    return this.props.classeCibleId;
  }

  get nbLignes(): number {
    return this.props.nbLignes;
  }

  get nbCreees(): number {
    return this.props.nbCreees;
  }

  get nbRejetees(): number {
    return this.props.nbRejetees;
  }

  
  get progression(): number {
    if (this.props.nbLignes === 0) return 0;
    return (this.props.nbCreees + this.props.nbRejetees) / this.props.nbLignes;
  }

  // --- Transitions (§5.4) ----------------------------------------------

  /** PUT /imports/{id}/correspondance : ELV-011 si un champ obligatoire n'est pas couvert. */
  enregistrerCorrespondance(correspondance: Record<string, string>): ImportLot {
    this.garantirStatut(["TELEVERSE"]);

    const champsCouverts = new Set(Object.values(correspondance));
    const manquants = CHAMPS_OBLIGATOIRES_IMPORT.filter(
      (champ) => !champsCouverts.has(champ)
    );
    if (manquants.length > 0) {
      throw new CorrespondanceIncompleteError(manquants);
    }

    return this.copierAvec({
      statut: "CORRESPONDANCE",
      correspondanceColonnes: correspondance,
    });
  }

  /** GET /imports/{id}/previsualisation : simple transition de statut, l'aperçu lui-même est un calcul de la couche application. */
  marquerPrevisualise(): ImportLot {
    this.garantirStatut(["CORRESPONDANCE"]);
    return this.copierAvec({ statut: "PREVISUALISE" });
  }

  /** POST /imports/{id}/executer : ELV-011 si le lot n'est pas encore prévisualisé. */
  demarrerExecution(): ImportLot {
    this.garantirStatut(["PREVISUALISE"]);
    return this.copierAvec({ statut: "EN_COURS" });
  }

  /**
   * Appelée une fois par ligne traitée par la couche application
   * (§4.5 : "transaction PAR LIGNE") — jamais en une seule fois pour
   * tout le lot.
   */
  enregistrerResultatLigne(statutLigne: "CREEE" | "REJETEE"): ImportLot {
    this.garantirStatut(["EN_COURS"]);
    return this.copierAvec(
      statutLigne === "CREEE"
        ? { nbCreees: this.props.nbCreees + 1 }
        : { nbRejetees: this.props.nbRejetees + 1 }
    );
  }

  /** Toutes les lignes ont été traitées (§4.5 : "lot.statut = TERMINE"). */
  terminer(): ImportLot {
    this.garantirStatut(["EN_COURS"]);
    return this.copierAvec({ statut: "TERMINE" });
  }

  /** Fichier illisible, vide, ou erreur avant même la correspondance (ELV-011). */
  echouer(): ImportLot {
    return this.copierAvec({ statut: "ECHOUE" });
  }

  private garantirStatut(attendus: StatutImportLot[]): void {
    if (!attendus.includes(this.props.statut)) {
      throw new TransitionImportInvalideError(this.props.statut, attendus);
    }
  }

  private copierAvec(changements: Partial<ImportLotProps>): ImportLot {
    return new ImportLot({ ...this.props, ...changements }, this.id);
  }
}