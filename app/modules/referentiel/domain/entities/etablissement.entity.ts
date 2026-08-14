import { Entity } from "~/shared/domain/entity";
import { Localisation } from "../shared/localisation.vo";
import { Entete } from "../shared/entete.vo";
import { StatutJuridique } from "../shared/statut-juridique";
import type { EtatCompteEtablissement } from "../shared/etat-compte-etablissement";
import { Signataire } from "./signataire.entity";
import {
  ActivationRefuseeError,
  ArchivageSansMotifError,
  SignataireIntrouvableError,
  SuspensionSansMotifError,
  TransitionEtatInvalideError,
} from "../errors/etablissement.errors";

interface EtablissementProps {
  nomOfficiel: string;
  sigle?: string;
  statutJuridique: StatutJuridique;
  numeroAgrement?: string;
  codeOfficiel: string;
  ville: string; 
  localisation: Localisation;
  entete: Entete;
  signataires: Signataire[];
  logoUrl?: string;
  etatCompte: EtatCompteEtablissement;
  dateDebutEssai?: string | null;
  dateFinEssai?: string | null;
  motifSuspension?: string | null;
  dateSuspension?: string | null;
  motifArchivage?: string | null;
  dateArchivage?: string | null;
  // Traçabilité (RM-12) — même esprit que ReferentielLifecycle, porté
  // directement ici plutôt que via une classe abstraite partagée : un
  // seul agrégat en a besoin dans ce module, contrairement au
  // Référentiel qui compte de nombreuses entités.
  dateCreation: string;
  dateModification: string;
  creePar: string;
  modifiePar: string;
}


export class Etablissement extends Entity<EtablissementProps> {
  private constructor(props: EtablissementProps, id: string) {
    super(props, id);
  }

  /** CU-01 : création par le super-administrateur, état initial EN_CREATION. */
  static create(
    id: string,
    props: {
      nomOfficiel: string;
      sigle?: string;
      statutJuridique: StatutJuridique;
      numeroAgrement?: string;
      codeOfficiel: string;
      ville: string;
      localisation: Localisation;
      entete: Entete;
      creePar: string;
      maintenant: string;
    }
  ): Etablissement {
    if (!props.nomOfficiel.trim()) {
      throw new Error("Le nom officiel de l'établissement est obligatoire.");
    }
    if (props.statutJuridique.requiertAgrement && !props.numeroAgrement?.trim()) {
      throw new Error(
        "Le numéro d'agrément est obligatoire pour un établissement privé (§2.2)."
      );
    }

    return new Etablissement(
      {
        ...props,
        signataires: [],
        etatCompte: "EN_CREATION",
        dateDebutEssai: null,
        dateFinEssai: null,
        motifSuspension: null,
        dateSuspension: null,
        motifArchivage: null,
        dateArchivage: null,
        dateCreation: props.maintenant,
        dateModification: props.maintenant,
        modifiePar: props.creePar,
      },
      id
    );
  }

  /** Reconstruction depuis des données déjà persistées (usage réservé à l'infrastructure). */
  static reconstruct(id: string, props: EtablissementProps): Etablissement {
    return new Etablissement(props, id);
  }

  
  static estDoublon(
    candidat: { nomOfficiel: string; arrondissementId: string; ville: string },
    existants: readonly { nomOfficiel: string; arrondissementId: string; ville: string }[]
  ): boolean {
    return existants.some(
      (e) =>
        e.nomOfficiel.trim().toLowerCase() === candidat.nomOfficiel.trim().toLowerCase() &&
        e.arrondissementId === candidat.arrondissementId &&
        e.ville.trim().toLowerCase() === candidat.ville.trim().toLowerCase()
    );
  }

  // --- Lecture -------------------------------------------------------

  get nomOfficiel(): string {
    return this.props.nomOfficiel;
  }

  get statutJuridique(): StatutJuridique {
    return this.props.statutJuridique;
  }

  get localisation(): Localisation {
    return this.props.localisation;
  }

  get entete(): Entete {
    return this.props.entete;
  }

  get signataires(): readonly Signataire[] {
    return this.props.signataires;
  }

  get signatairePrincipal(): Signataire | undefined {
    return this.props.signataires.find((s) => s.estPrincipal && s.estActif);
  }

  get logoUrl(): string | undefined {
    return this.props.logoUrl;
  }

  get etatCompte(): EtatCompteEtablissement {
    return this.props.etatCompte;
  }

 
  elementsManquantsPourActivation(): string[] {
    const manquants: string[] = [];
    if (!this.props.logoUrl) manquants.push("logo");
    if (!this.props.entete.estComplet) manquants.push("en-tête complet");
    if (!this.signatairePrincipal) manquants.push("signataire principal");
    return manquants;
  }

  get estComplet(): boolean {
    return this.elementsManquantsPourActivation().length === 0;
  }

  // --- Signataires (RM-07, RM-11, CU-03) ------------------------------

  ajouterSignataire(signataire: Signataire, maintenant: string, parUtilisateurId: string): Etablissement {
    return this.copierAvec(
      { signataires: [...this.props.signataires, signataire] },
      maintenant,
      parUtilisateurId
    );
  }

 
  designerSignatairePrincipal(
    signataireId: string,
    maintenant: string,
    parUtilisateurId: string
  ): Etablissement {
    const cible = this.props.signataires.find((s) => s.id === signataireId);
    if (!cible) throw new SignataireIntrouvableError(signataireId);
    if (!cible.estActif) {
      throw new Error("Un signataire désactivé ne peut pas devenir principal.");
    }

    const signataires = this.props.signataires.map((s) =>
      s.id === signataireId ? s.avecStatutPrincipal(true) : s.avecStatutPrincipal(false)
    );
    return this.copierAvec({ signataires }, maintenant, parUtilisateurId);
  }

  /** CU-03, alternative A1 : désactivation, jamais suppression (RM-11). */
  desactiverSignataire(
    signataireId: string,
    dateFinFonction: string,
    maintenant: string,
    parUtilisateurId: string
  ): Etablissement {
    const cible = this.props.signataires.find((s) => s.id === signataireId);
    if (!cible) throw new SignataireIntrouvableError(signataireId);

    const signataires = this.props.signataires.map((s) =>
      s.id === signataireId ? s.desactiver(dateFinFonction) : s
    );
    return this.copierAvec({ signataires }, maintenant, parUtilisateurId);
  }

  // --- Fiche d'identité ------------------------------------------------

  changerLogo(logoUrl: string, maintenant: string, parUtilisateurId: string): Etablissement {
    return this.copierAvec({ logoUrl }, maintenant, parUtilisateurId);
  }

  changerEntete(entete: Entete, maintenant: string, parUtilisateurId: string): Etablissement {
    return this.copierAvec({ entete }, maintenant, parUtilisateurId);
  }

  /** Déménagement (FAQ 9) : la fiche change, l'historique des documents déjà émis ne bouge pas. */
  changerLocalisation(
    localisation: Localisation,
    maintenant: string,
    parUtilisateurId: string
  ): Etablissement {
    return this.copierAvec({ localisation }, maintenant, parUtilisateurId);
  }

  // --- Cycle de vie du compte (RM-02, RM-08, RM-09, RM-10) ------------

  passerEnEssai(
    dateDebutEssai: string,
    dateFinEssai: string,
    maintenant: string,
    parUtilisateurId: string
  ): Etablissement {
    this.garantirTransition("EN_ESSAI", ["EN_CREATION"]);
    return this.copierAvec(
      { etatCompte: "EN_ESSAI", dateDebutEssai, dateFinEssai },
      maintenant,
      parUtilisateurId
    );
  }

  /** CU-04 : refus systématique et précis si incomplet (RM-08). */
  activer(maintenant: string, parUtilisateurId: string): Etablissement {
    this.garantirTransition("ACTIF", ["EN_CREATION", "EN_ESSAI"]);
    const manquants = this.elementsManquantsPourActivation();
    if (manquants.length > 0) {
      throw new ActivationRefuseeError(manquants);
    }
    return this.copierAvec({ etatCompte: "ACTIF" }, maintenant, parUtilisateurId);
  }

  /** CU-05 : motif obligatoire, réversible (RM-09). */
  suspendre(motif: string, maintenant: string, parUtilisateurId: string): Etablissement {
    this.garantirTransition("SUSPENDU", ["ACTIF"]);
    if (!motif.trim()) throw new SuspensionSansMotifError();
    return this.copierAvec(
      { etatCompte: "SUSPENDU", motifSuspension: motif, dateSuspension: maintenant },
      maintenant,
      parUtilisateurId
    );
  }

  /** CU-05 : réactivation, restitution intacte (RM-09). */
  reactiver(maintenant: string, parUtilisateurId: string): Etablissement {
    this.garantirTransition("ACTIF", ["SUSPENDU"]);
    return this.copierAvec(
      { etatCompte: "ACTIF", motifSuspension: null, dateSuspension: null },
      maintenant,
      parUtilisateurId
    );
  }

  /** RM-10 : définitif, motivé, mais jamais une suppression (RM-11). */
  archiver(motif: string, maintenant: string, parUtilisateurId: string): Etablissement {
    if (this.props.etatCompte === "ARCHIVE") {
      throw new TransitionEtatInvalideError(this.props.etatCompte, "ARCHIVE");
    }
    if (!motif.trim()) throw new ArchivageSansMotifError();
    return this.copierAvec(
      { etatCompte: "ARCHIVE", motifArchivage: motif, dateArchivage: maintenant },
      maintenant,
      parUtilisateurId
    );
  }

  private garantirTransition(
    versEtat: EtatCompteEtablissement,
    depuisEtatsAutorises: EtatCompteEtablissement[]
  ): void {
    if (!depuisEtatsAutorises.includes(this.props.etatCompte)) {
      throw new TransitionEtatInvalideError(this.props.etatCompte, versEtat);
    }
  }

  /** RM-12 : toute modification est tracée (qui, quand). Centralisé ici pour ne jamais l'oublier. */
  private copierAvec(
    changements: Partial<EtablissementProps>,
    maintenant: string,
    parUtilisateurId: string
  ): Etablissement {
    return new Etablissement(
      {
        ...this.props,
        ...changements,
        dateModification: maintenant,
        modifiePar: parUtilisateurId,
      },
      this.id
    );
  }
}