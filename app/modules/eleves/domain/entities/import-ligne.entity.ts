import { Entity } from "~/shared/domain/entity";
import type { StatutImportLigne } from "../shared/statut-import-ligne";
import { LigneDejaTraiteeError } from "../errors/import.errors";

interface ImportLigneProps {
  lotId: string;
  numeroLigne: number;
  /** Données brutes de la ligne du fichier, clés = en-têtes originaux du fichier (§2.5). */
  donneesBrutes: Record<string, string>;
  statut: StatutImportLigne;
  codeRejet?: string;
  messageRejet?: string;
  eleveId?: string;
}


export class ImportLigne extends Entity<ImportLigneProps> {
  private constructor(props: ImportLigneProps, id: string) {
    super(props, id);
  }

  /** Créée en statut VALIDE : a passé les contrôles de format de base (correspondance de colonnes). */
  static create(
    id: string,
    props: {
      lotId: string;
      numeroLigne: number;
      donneesBrutes: Record<string, string>;
    }
  ): ImportLigne {
    return new ImportLigne({ ...props, statut: "VALIDE" }, id);
  }

  /** Reconstruction depuis des données déjà persistées (usage réservé à l'infrastructure). */
  static reconstruct(id: string, props: ImportLigneProps): ImportLigne {
    return new ImportLigne(props, id);
  }

  get lotId(): string {
    return this.props.lotId;
  }

  get numeroLigne(): number {
    return this.props.numeroLigne;
  }

  get donneesBrutes(): Readonly<Record<string, string>> {
    return this.props.donneesBrutes;
  }

  get statut(): StatutImportLigne {
    return this.props.statut;
  }

  get codeRejet(): string | undefined {
    return this.props.codeRejet;
  }

  get messageRejet(): string | undefined {
    return this.props.messageRejet;
  }

  get eleveId(): string | undefined {
    return this.props.eleveId;
  }

  /** Exécution réussie (§4.5) : fiche (et inscription éventuelle) créée avec succès. */
  marquerCreee(eleveId: string): ImportLigne {
    this.garantirNonTraitee();
    return new ImportLigne(
      { ...this.props, statut: "CREEE", eleveId },
      this.id
    );
  }

  /** Exécution en échec pour cette ligne (§4.5) : code et message TOUJOURS renseignés (RM-E-11 — jamais un rejet muet). */
  marquerRejetee(code: string, message: string): ImportLigne {
    this.garantirNonTraitee();
    return new ImportLigne(
      { ...this.props, statut: "REJETEE", codeRejet: code, messageRejet: message },
      this.id
    );
  }

  /** Une ligne rejetée peut être reprise dans un nouveau lot (dossier fonctionnel §3.6 : "ré-importer uniquement les rejets") — jamais modifiée sur place. */
  private garantirNonTraitee(): void {
    if (this.props.statut !== "VALIDE") {
      throw new LigneDejaTraiteeError(this.props.numeroLigne);
    }
  }
}