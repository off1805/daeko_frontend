import { Entity } from "~/shared/domain/entity";
import { Identite } from "../shared/identite.vo";
import type { EtatEleve } from "../shared/etat-eleve";
import { Tuteur } from "./tuteur.entity";
import {
  AucunContactPrincipalError,
  AucunTuteurError,
  DernierTuteurPrincipalError,
  TuteurIntrouvableError,
} from "../errors/eleve.errors";

interface EleveProps {
  etablissementId: string;
  matricule: string;
  identite: Identite;
  photoUrl?: string;
  etat: EtatEleve;
  tuteurs: Tuteur[];
  dateCreation: string;
  dateModification: string;
}


export class Eleve extends Entity<EleveProps> {
  private constructor(props: EleveProps, id: string) {
    super(props, id);
  }

  
  static create(
    id: string,
    props: {
      etablissementId: string;
      matricule: string;
      identite: Identite;
      photoUrl?: string;
      premiersTuteurs: Tuteur[]; // au moins un, un seul avec estContactPrincipal = true
      maintenant: string;
    }
  ): Eleve {
    if (!props.matricule.trim()) {
      throw new Error("Le matricule national est obligatoire.");
    }
    Eleve.garantirTuteursValides(props.premiersTuteurs);

    return new Eleve(
      {
        etablissementId: props.etablissementId,
        matricule: props.matricule.trim(),
        identite: props.identite,
        photoUrl: props.photoUrl,
        etat: "ACTIF",
        tuteurs: props.premiersTuteurs,
        dateCreation: props.maintenant,
        dateModification: props.maintenant,
      },
      id
    );
  }

  /** Reconstruction depuis des données déjà persistées (usage réservé à l'infrastructure). */
  static reconstruct(id: string, props: EleveProps): Eleve {
    return new Eleve(props, id);
  }

  
  private static garantirTuteursValides(tuteurs: Tuteur[]): void {
    if (tuteurs.length === 0) {
      throw new AucunTuteurError();
    }
    const principaux = tuteurs.filter((t) => t.estContactPrincipal);
    if (principaux.length === 0) {
      throw new AucunContactPrincipalError();
    }
    // Le CHECK SQL ux_tuteur_principal garantit qu'il n'y en a jamais
    // deux en base ; ce garde-fou applicatif évite déjà d'en construire
    // deux en mémoire avant même d'écrire.
  }

  // --- Lecture ---------------------------------------------------------

  get etablissementId(): string {
    return this.props.etablissementId;
  }

  get matricule(): string {
    return this.props.matricule;
  }

  get identite(): Identite {
    return this.props.identite;
  }

  get photoUrl(): string | undefined {
    return this.props.photoUrl;
  }

  get etat(): EtatEleve {
    return this.props.etat;
  }

  get estActif(): boolean {
    return this.props.etat === "ACTIF";
  }

  get tuteurs(): readonly Tuteur[] {
    return this.props.tuteurs;
  }

  get contactPrincipal(): Tuteur | undefined {
    return this.props.tuteurs.find((t) => t.estContactPrincipal);
  }

  // --- Tuteurs (RM-E-04, ELV-006, ELV-014) ------------------------------

  ajouterTuteur(tuteur: Tuteur, maintenant: string): Eleve {
    // Si le nouveau tuteur est désigné principal, on rétrograde
    // l'ancien dans la même opération (même logique que Signataire).
    const tuteurs = tuteur.estContactPrincipal
      ? [...this.props.tuteurs.map((t) => t.avecStatutPrincipal(false)), tuteur]
      : [...this.props.tuteurs, tuteur];

    return this.copierAvec({ tuteurs }, maintenant);
  }

  /** POST /tuteurs/{id}/definir-principal : bascule atomique. */
  definirTuteurPrincipal(tuteurId: string, maintenant: string): Eleve {
    const cible = this.props.tuteurs.find((t) => t.id === tuteurId);
    if (!cible) throw new TuteurIntrouvableError(tuteurId);

    const tuteurs = this.props.tuteurs.map((t) =>
      t.id === tuteurId ? t.avecStatutPrincipal(true) : t.avecStatutPrincipal(false)
    );
    return this.copierAvec({ tuteurs }, maintenant);
  }

  /** DELETE /tuteurs/{id} : refusé si dernier tuteur, ou principal sans remplaçant (ELV-014). */
  supprimerTuteur(tuteurId: string, maintenant: string): Eleve {
    const cible = this.props.tuteurs.find((t) => t.id === tuteurId);
    if (!cible) throw new TuteurIntrouvableError(tuteurId);

    const restants = this.props.tuteurs.filter((t) => t.id !== tuteurId);

    if (restants.length === 0) {
      throw new DernierTuteurPrincipalError();
    }
    if (cible.estContactPrincipal && !restants.some((t) => t.estContactPrincipal)) {
      throw new DernierTuteurPrincipalError();
    }

    return this.copierAvec({ tuteurs: restants }, maintenant);
  }

  modifierTuteur(
    tuteurId: string,
    changements: { nom?: string; telephone?: string; profession?: string; adresse?: string },
    maintenant: string
  ): Eleve {
    const cible = this.props.tuteurs.find((t) => t.id === tuteurId);
    if (!cible) throw new TuteurIntrouvableError(tuteurId);

    const tuteurs = this.props.tuteurs.map((t) =>
      t.id === tuteurId ? t.modifierCoordonnees(changements) : t
    );
    return this.copierAvec({ tuteurs }, maintenant);
  }

  // --- Fiche -------------------------------------------------------------

  modifierIdentite(identite: Identite, maintenant: string): Eleve {
    return this.copierAvec({ identite }, maintenant);
  }

  changerMatricule(matricule: string, maintenant: string): Eleve {
    if (!matricule.trim()) {
      throw new Error("Le matricule national est obligatoire.");
    }
    return this.copierAvec({ matricule: matricule.trim() }, maintenant);
  }

  changerPhoto(photoUrl: string, maintenant: string): Eleve {
    return this.copierAvec({ photoUrl }, maintenant);
  }

  
  archiver(maintenant: string): Eleve {
    return this.copierAvec({ etat: "ARCHIVE" }, maintenant);
  }

  reactiver(maintenant: string): Eleve {
    return this.copierAvec({ etat: "ACTIF" }, maintenant);
  }

  private copierAvec(changements: Partial<EleveProps>, maintenant: string): Eleve {
    return new Eleve(
      { ...this.props, ...changements, dateModification: maintenant },
      this.id
    );
  }
}