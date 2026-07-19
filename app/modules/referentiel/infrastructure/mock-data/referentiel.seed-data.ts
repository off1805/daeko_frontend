import type { ReferentielLifecycle } from "~/modules/referentiel/domain/shared/referentiel-entity";
import { LibelleBilingue } from "~/modules/referentiel/domain/shared/libelle-bilingue.vo";
import {
  OrdreEnseignement,
  SousSysteme,
  TypeEnseignement,
} from "~/modules/referentiel/domain/entities/tables-racines.entity";
import {
  Cycle,
  Niveau,
} from "~/modules/referentiel/domain/entities/chaine-temporelle.entity";
import {
  Filiere,
  Serie,
} from "~/modules/referentiel/domain/entities/chaine-pedagogique.entity";
import {
  MatiereReferentiel,
  MatiereReferentielNiveau,
} from "~/modules/referentiel/domain/entities/catalogue-matieres.entity";
import { AuditEntry } from "~/modules/referentiel/domain/entities/audit-entry.entity";

/**
 * Périmètre minimal représentatif de la section 7.1 du dossier, pour
 * exercer le module côté frontend avant que le vrai backend n'existe.
 * Non exhaustif (la matrice matiere_referentiel_niveau complète est
 * explicitement hors-scope frontend : "à générer par script à partir d'un
 * fichier validé par un expert pédagogique", doc 7.1).
 */

const SEED_AUTEUR_ID = "00000000-0000-4000-8000-000000000000";
const SEED_DATE_ENTREE = "2024-09-01";
const SEED_DATE_CREATION = "2024-09-01T08:00:00.000Z";

function lifecycle(): ReferentielLifecycle {
  return {
    etat: "ACTIVE",
    dateEntreeVigueur: SEED_DATE_ENTREE,
    dateDepreciation: null,
    motifDepreciation: null,
    dateCreation: SEED_DATE_CREATION,
    dateModification: SEED_DATE_CREATION,
    creePar: SEED_AUTEUR_ID,
    modifiePar: SEED_AUTEUR_ID,
  };
}

function id(): string {
  return crypto.randomUUID();
}

// --- 3.3 Tables racines ----------------------------------------------------

const idSousSystemeFr = id();
const idSousSystemeEn = id();

export const sousSystemesSeed: SousSysteme[] = [
  SousSysteme.create(
    {
      ...lifecycle(),
      code: "FR",
      libelle: "Francophone",
      libelleCourt: "FR",
      languePrincipale: "fr",
    },
    idSousSystemeFr,
  ),
  SousSysteme.create(
    {
      ...lifecycle(),
      code: "EN",
      libelle: "Anglophone",
      libelleCourt: "EN",
      languePrincipale: "en",
    },
    idSousSystemeEn,
  ),
];

const idOrdreMaternelle = id();
const idOrdrePrimaire = id();
const idOrdreSecondaire = id();
const idOrdreNormal = id();

export const ordresEnseignementSeed: OrdreEnseignement[] = [
  OrdreEnseignement.create(
    { ...lifecycle(), code: "MATERNELLE", libelle: "Maternelle", rang: 1 },
    idOrdreMaternelle,
  ),
  OrdreEnseignement.create(
    {
      ...lifecycle(),
      code: "PRIMAIRE",
      libelle: "Primaire",
      tutelleMinisterielle: LibelleBilingue.create(
        "MINEDUB",
        "MINEDUB",
      ),
      rang: 2,
    },
    idOrdrePrimaire,
  ),
  OrdreEnseignement.create(
    {
      ...lifecycle(),
      code: "SECONDAIRE",
      libelle: "Secondaire",
      tutelleMinisterielle: LibelleBilingue.create("MINESEC", "MINESEC"),
      rang: 3,
    },
    idOrdreSecondaire,
  ),
  OrdreEnseignement.create(
    {
      ...lifecycle(),
      code: "NORMAL",
      libelle: "Normal",
      tutelleMinisterielle: LibelleBilingue.create("MINESEC", "MINESEC"),
      rang: 4,
    },
    idOrdreNormal,
  ),
];

const idTypeGeneral = id();
const idTypeTechInd = id();
const idTypeTechCom = id();
const idTypeNormal = id();

export const typesEnseignementSeed: TypeEnseignement[] = [
  TypeEnseignement.create(
    { ...lifecycle(), code: "GENERAL", libelle: "Enseignement général" },
    idTypeGeneral,
  ),
  TypeEnseignement.create(
    {
      ...lifecycle(),
      code: "TECH_IND",
      libelle: "Enseignement technique industriel",
    },
    idTypeTechInd,
  ),
  TypeEnseignement.create(
    {
      ...lifecycle(),
      code: "TECH_COM",
      libelle: "Enseignement technique commercial",
    },
    idTypeTechCom,
  ),
  TypeEnseignement.create(
    { ...lifecycle(), code: "NORMAL", libelle: "Enseignement normal" },
    idTypeNormal,
  ),
];

// --- 3.4 Chaîne temporelle : cycle, niveau ---------------------------------

const idCycleFrSec1 = id();
const idCycleFrSec2 = id();
const idCycleEnSec1 = id();
const idCycleEnSec2 = id();

export const cyclesSeed: Cycle[] = [
  Cycle.create(
    {
      ...lifecycle(),
      sousSystemeId: idSousSystemeFr,
      ordreEnseignementId: idOrdreSecondaire,
      code: "SEC_1",
      libelle: LibelleBilingue.create("Premier cycle", "First cycle"),
      rang: 1,
      dureeTheoriqueAnnees: 4,
    },
    idCycleFrSec1,
  ),
  Cycle.create(
    {
      ...lifecycle(),
      sousSystemeId: idSousSystemeFr,
      ordreEnseignementId: idOrdreSecondaire,
      code: "SEC_2",
      libelle: LibelleBilingue.create("Second cycle", "Second cycle"),
      rang: 2,
      dureeTheoriqueAnnees: 3,
    },
    idCycleFrSec2,
  ),
  Cycle.create(
    {
      ...lifecycle(),
      sousSystemeId: idSousSystemeEn,
      ordreEnseignementId: idOrdreSecondaire,
      code: "SEC_1",
      libelle: LibelleBilingue.create("Premier cycle", "First cycle"),
      rang: 1,
      dureeTheoriqueAnnees: 5,
    },
    idCycleEnSec1,
  ),
  Cycle.create(
    {
      ...lifecycle(),
      sousSystemeId: idSousSystemeEn,
      ordreEnseignementId: idOrdreSecondaire,
      code: "SEC_2",
      libelle: LibelleBilingue.create("Second cycle", "Second cycle"),
      rang: 2,
      dureeTheoriqueAnnees: 2,
    },
    idCycleEnSec2,
  ),
];

function niveau(
  cycleId: string,
  code: string,
  libelleFr: string,
  libelleEn: string,
  rangDansCycle: number,
): Niveau {
  return Niveau.create(
    {
      ...lifecycle(),
      cycleId,
      code,
      libelle: LibelleBilingue.create(libelleFr, libelleEn),
      rangDansCycle,
    },
    id(),
  );
}

const niveau6eme = niveau(idCycleFrSec1, "6EME", "Sixième", "Form 1 (FR)", 1);
const niveau5eme = niveau(idCycleFrSec1, "5EME", "Cinquième", "Form 2 (FR)", 2);
const niveau4eme = niveau(idCycleFrSec1, "4EME", "Quatrième", "Form 3 (FR)", 3);
const niveau3eme = niveau(idCycleFrSec1, "3EME", "Troisième", "Form 4 (FR)", 4);
const niveau2nde = niveau(idCycleFrSec2, "2NDE", "Seconde", "Lower Sixth (FR)", 1);
const niveau1ere = niveau(idCycleFrSec2, "1ERE", "Première", "Upper Sixth (FR)", 2);
const niveauTerm = niveau(idCycleFrSec2, "TERM", "Terminale", "Form 7 (FR)", 3);

const niveauForm1 = niveau(idCycleEnSec1, "FORM_1", "Form 1", "Form 1", 1);
const niveauForm2 = niveau(idCycleEnSec1, "FORM_2", "Form 2", "Form 2", 2);
const niveauForm3 = niveau(idCycleEnSec1, "FORM_3", "Form 3", "Form 3", 3);
const niveauForm4 = niveau(idCycleEnSec1, "FORM_4", "Form 4", "Form 4", 4);
const niveauForm5 = niveau(idCycleEnSec1, "FORM_5", "Form 5", "Form 5", 5);
const niveauLowerSix = niveau(idCycleEnSec2, "LOWER_SIX", "Lower Sixth", "Lower Sixth", 1);
const niveauUpperSix = niveau(idCycleEnSec2, "UPPER_SIX", "Upper Sixth", "Upper Sixth", 2);

export const niveauxSeed: Niveau[] = [
  niveau6eme,
  niveau5eme,
  niveau4eme,
  niveau3eme,
  niveau2nde,
  niveau1ere,
  niveauTerm,
  niveauForm1,
  niveauForm2,
  niveauForm3,
  niveauForm4,
  niveauForm5,
  niveauLowerSix,
  niveauUpperSix,
];

// --- 3.5 Chaîne pédagogique : filière, série -------------------------------
// ordre_enseignement/type_enseignement sont indépendants du sous-système :
// une même filière (ex: SECONDAIRE x GENERAL) sert de support à des séries
// FR et EN, distinguées par leur niveau_apparition_id.

const idFiliereGen = id();
const idFiliereInd = id();
const idFiliereCom = id();
const idFiliereEnieg = id();
const idFiliereEniet = id();

export const filieresSeed: Filiere[] = [
  Filiere.create(
    {
      ...lifecycle(),
      ordreEnseignementId: idOrdreSecondaire,
      typeEnseignementId: idTypeGeneral,
      code: "GEN",
      libelle: LibelleBilingue.create(
        "Enseignement général",
        "General education",
      ),
    },
    idFiliereGen,
  ),
  Filiere.create(
    {
      ...lifecycle(),
      ordreEnseignementId: idOrdreSecondaire,
      typeEnseignementId: idTypeTechInd,
      code: "IND",
      libelle: LibelleBilingue.create(
        "Enseignement technique industriel",
        "Industrial technical education",
      ),
    },
    idFiliereInd,
  ),
  Filiere.create(
    {
      ...lifecycle(),
      ordreEnseignementId: idOrdreSecondaire,
      typeEnseignementId: idTypeTechCom,
      code: "COM",
      libelle: LibelleBilingue.create(
        "Enseignement technique commercial",
        "Commercial technical education",
      ),
    },
    idFiliereCom,
  ),
  Filiere.create(
    {
      ...lifecycle(),
      ordreEnseignementId: idOrdreNormal,
      typeEnseignementId: idTypeNormal,
      code: "ENIEG",
      libelle: LibelleBilingue.create(
        "École normale des instituteurs de l'enseignement général",
        "Teacher training college — general education",
      ),
    },
    idFiliereEnieg,
  ),
  Filiere.create(
    {
      ...lifecycle(),
      ordreEnseignementId: idOrdreNormal,
      typeEnseignementId: idTypeNormal,
      code: "ENIET",
      libelle: LibelleBilingue.create(
        "École normale des instituteurs de l'enseignement technique",
        "Teacher training college — technical education",
      ),
    },
    idFiliereEniet,
  ),
];

function serie(
  filiereId: string,
  niveauApparitionId: string,
  code: string,
  libelleFr: string,
  libelleEn: string,
): Serie {
  return Serie.create(
    {
      ...lifecycle(),
      filiereId,
      niveauApparitionId,
      code,
      libelle: LibelleBilingue.create(libelleFr, libelleEn),
      libelleCourt: code,
    },
    id(),
  );
}

export const seriesSeed: Serie[] = [
  serie(idFiliereGen, niveau2nde.id, "A", "Série A — Lettres", "Series A — Arts"),
  serie(idFiliereGen, niveau2nde.id, "C", "Série C — Mathématiques et sciences physiques", "Series C — Mathematics and Physical Sciences"),
  serie(idFiliereGen, niveau2nde.id, "D", "Série D — Sciences de la vie et de la Terre", "Series D — Life and Earth Sciences"),
  serie(idFiliereGen, niveau2nde.id, "E", "Série E — Mathématiques et technologie", "Series E — Mathematics and Technology"),
  serie(idFiliereGen, niveau2nde.id, "TI", "Série TI — Techniques industrielles", "Series TI — Industrial Techniques"),
  serie(idFiliereInd, niveau2nde.id, "F1", "Série F1 — Électrotechnique", "Series F1 — Electrical Engineering"),
  serie(idFiliereInd, niveau2nde.id, "F2", "Série F2 — Mécanique générale", "Series F2 — General Mechanics"),
  serie(idFiliereInd, niveau2nde.id, "F3", "Série F3 — Électronique", "Series F3 — Electronics"),
  serie(idFiliereInd, niveau2nde.id, "F4", "Série F4 — Construction bâtiment", "Series F4 — Building Construction"),
  serie(idFiliereCom, niveau2nde.id, "G1", "Série G1 — Technique administrative", "Series G1 — Administrative Techniques"),
  serie(idFiliereCom, niveau2nde.id, "G2", "Série G2 — Technique comptable", "Series G2 — Accounting Techniques"),
  serie(idFiliereCom, niveau2nde.id, "G3", "Série G3 — Technique commerciale", "Series G3 — Commercial Techniques"),
  serie(idFiliereGen, niveauForm4.id, "ARTS", "Arts — filière littéraire", "Arts stream"),
  serie(idFiliereGen, niveauForm4.id, "SCIENCE", "Sciences — filière scientifique", "Science stream"),
  serie(idFiliereGen, niveauForm4.id, "COMMERCIAL", "Commercial — filière commerciale", "Commercial stream"),
];

const serieC = seriesSeed.find((s) => s.code === "C")!;

// --- 3.6 Catalogue des matières ---------------------------------------------

function matiere(
  sousSystemeId: string,
  code: string,
  libelleFr: string,
  libelleEn: string,
  domaine: MatiereReferentiel["domaine"],
  typeMatiere: MatiereReferentiel["typeMatiere"],
): MatiereReferentiel {
  return MatiereReferentiel.create(
    {
      ...lifecycle(),
      sousSystemeId,
      code,
      libelle: LibelleBilingue.create(libelleFr, libelleEn),
      domaine,
      typeMatiere,
      baremeParDefaut: 20,
    },
    id(),
  );
}

const matiereMathFr = matiere(idSousSystemeFr, "MATH", "Mathématiques", "Mathematics", "SCIENCES", "FONDAMENTALE");
const matiereFr = matiere(idSousSystemeFr, "FR", "Français", "French", "LETTRES", "FONDAMENTALE");
const matiereAng = matiere(idSousSystemeFr, "ANG", "Anglais", "English", "LANGUES", "FONDAMENTALE");
const matierePc = matiere(idSousSystemeFr, "PC", "Physique-Chimie", "Physics-Chemistry", "SCIENCES", "FONDAMENTALE");
const matiereSvt = matiere(idSousSystemeFr, "SVT", "Sciences de la vie et de la Terre", "Life and Earth Sciences", "SCIENCES", "SECONDAIRE");
const matiereHistGeo = matiere(idSousSystemeFr, "HIST_GEO", "Histoire-Géographie", "History-Geography", "SCIENCES_HUMAINES", "SECONDAIRE");
const matierePhilo = matiere(idSousSystemeFr, "PHILO", "Philosophie", "Philosophy", "LETTRES", "FONDAMENTALE");
const matiereEps = matiere(idSousSystemeFr, "EPS", "Éducation physique et sportive", "Physical Education", "SPORT", "TRANSVERSALE");

const matiereMathEn = matiere(idSousSystemeEn, "MATH", "Mathematics", "Mathematics", "SCIENCES", "FONDAMENTALE");
const matiereEng = matiere(idSousSystemeEn, "ENG", "English", "English", "LETTRES", "FONDAMENTALE");
const matiereFre = matiere(idSousSystemeEn, "FRE", "French", "French", "LANGUES", "FONDAMENTALE");
const matiereBio = matiere(idSousSystemeEn, "BIO", "Biology", "Biology", "SCIENCES", "SECONDAIRE");
const matiereChem = matiere(idSousSystemeEn, "CHEM", "Chemistry", "Chemistry", "SCIENCES", "SECONDAIRE");
const matiereLit = matiere(idSousSystemeEn, "LIT", "Literature", "Literature", "LETTRES", "OPTIONNELLE");

export const matieresReferentielSeed: MatiereReferentiel[] = [
  matiereMathFr,
  matiereFr,
  matiereAng,
  matierePc,
  matiereSvt,
  matiereHistGeo,
  matierePhilo,
  matiereEps,
  matiereMathEn,
  matiereEng,
  matiereFre,
  matiereBio,
  matiereChem,
  matiereLit,
];

function matiereNiveau(
  matiereReferentielId: string,
  niveauId: string,
  options: {
    serieId?: string;
    coefficientSuggere?: number;
    sourceCoefficient?: string;
    estObligatoire?: boolean;
  } = {},
): MatiereReferentielNiveau {
  return MatiereReferentielNiveau.create(
    {
      ...lifecycle(),
      matiereReferentielId,
      niveauId,
      serieId: options.serieId,
      estObligatoire: options.estObligatoire ?? true,
      coefficientSuggere: options.coefficientSuggere,
      sourceCoefficient: options.sourceCoefficient,
    },
    id(),
  );
}

export const matieresReferentielNiveauSeed: MatiereReferentielNiveau[] = [
  // MATH est obligatoire à tous les niveaux du secondaire FR ; coefficient
  // renforcé en série C au niveau TERM (illustre la ligne avec-série ET
  // la ligne sans-série pour le même couple matière/niveau).
  matiereNiveau(matiereMathFr.id, niveau6eme.id, {
    coefficientSuggere: 4,
    sourceCoefficient: "Arrêté n°2015/MINESEC",
  }),
  matiereNiveau(matiereMathFr.id, niveauTerm.id, {
    coefficientSuggere: 3,
    sourceCoefficient: "Arrêté n°2015/MINESEC",
  }),
  matiereNiveau(matiereMathFr.id, niveauTerm.id, {
    serieId: serieC.id,
    coefficientSuggere: 6,
    sourceCoefficient: "Arrêté n°2015/MINESEC",
  }),
  matiereNiveau(matiereFr.id, niveau6eme.id, {
    coefficientSuggere: 4,
    sourceCoefficient: "Arrêté n°2015/MINESEC",
  }),
  matiereNiveau(matiereAng.id, niveau6eme.id, {
    coefficientSuggere: 2,
    sourceCoefficient: "Arrêté n°2015/MINESEC",
  }),
  matiereNiveau(matierePhilo.id, niveauTerm.id, {
    serieId: serieC.id,
    coefficientSuggere: 2,
    sourceCoefficient: "Arrêté n°2015/MINESEC",
  }),
  matiereNiveau(matiereEps.id, niveau6eme.id, {
    estObligatoire: false,
    coefficientSuggere: 1,
  }),
  matiereNiveau(matiereMathEn.id, niveauForm1.id, {
    coefficientSuggere: 4,
    sourceCoefficient: "GCE Board syllabus",
  }),
  matiereNiveau(matiereEng.id, niveauForm1.id, {
    coefficientSuggere: 4,
    sourceCoefficient: "GCE Board syllabus",
  }),
  matiereNiveau(matiereLit.id, niveauForm1.id, {
    estObligatoire: false,
    coefficientSuggere: 2,
  }),
];

// --- 3.7 Audit ---------------------------------------------------------------
// Quelques entrées illustratives (une piste réelle n'a de sens qu'une fois
// des écritures effectuées via les use-cases, mais l'UI de consultation a
// besoin de données à afficher dès le départ).

export const auditSeed: AuditEntry[] = [
  AuditEntry.create(
    {
      typeEntite: "sous_systeme",
      entiteId: idSousSystemeFr,
      operation: "CREATION",
      utilisateurId: SEED_AUTEUR_ID,
      horodatage: SEED_DATE_CREATION,
      valeursAvant: null,
      valeursApres: { code: "FR", libelle: "Francophone" },
      motif: null,
    },
    id(),
  ),
  AuditEntry.create(
    {
      typeEntite: "sous_systeme",
      entiteId: idSousSystemeEn,
      operation: "CREATION",
      utilisateurId: SEED_AUTEUR_ID,
      horodatage: SEED_DATE_CREATION,
      valeursAvant: null,
      valeursApres: { code: "EN", libelle: "Anglophone" },
      motif: null,
    },
    id(),
  ),
];
