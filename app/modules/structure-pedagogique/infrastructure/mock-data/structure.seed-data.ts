import { Branche } from "~/modules/structure-pedagogique/domain/entities/branche.entity";
import type { MatiereLocale } from "~/modules/structure-pedagogique/domain/entities/matiere-locale.entity";
import { AnneeAcademique } from "~/modules/structure-pedagogique/domain/entities/annee-academique.entity";
import { ConfigurationBrancheAnnee } from "~/modules/structure-pedagogique/domain/entities/configuration-branche-annee.entity";
import {
  FiliereActive,
  NiveauActive,
  SerieActive,
} from "~/modules/structure-pedagogique/domain/entities/activation.entity";
import { MatiereActive } from "~/modules/structure-pedagogique/domain/entities/matiere-active.entity";
import { Classe } from "~/modules/structure-pedagogique/domain/entities/classe.entity";
import { AuditStructure } from "~/modules/structure-pedagogique/domain/entities/audit-structure.entity";
import {
  filieresSeed,
  matieresReferentielSeed,
  niveauxSeed,
  ordresEnseignementSeed,
  seriesSeed,
  sousSystemesSeed,
  typesEnseignementSeed,
} from "~/modules/referentiel/infrastructure/mock-data/referentiel.seed-data";

/**
 * Jeu de démonstration minimal (doc section 7.1, adapté au périmètre v1
 * frontend) : une branche "Francophone — Secondaire — Général" ACTIVE avec
 * une année EN_COURS déjà configurée, pour que le tableau de bord démarre
 * en état stable plutôt qu'en onboarding permanent — voir le plan.
 */

const SEED_AUTEUR_ID = "00000000-0000-4000-8000-000000000000";
const SEED_DATE = "2025-09-01T08:00:00.000Z";

function id(): string {
  return crypto.randomUUID();
}

const sousSystemeFr = sousSystemesSeed.find((s) => s.code === "FR")!;
const ordreSecondaire = ordresEnseignementSeed.find((o) => o.code === "SECONDAIRE")!;
const typeGeneral = typesEnseignementSeed.find((t) => t.code === "GENERAL")!;

const idBranche = id();
export const branchesSeed: Branche[] = [
  Branche.create(
    {
      sousSystemeId: sousSystemeFr.id,
      ordreEnseignementId: ordreSecondaire.id,
      typeEnseignementId: typeGeneral.id,
      libelle: "Francophone — Secondaire — Général",
      etat: "ACTIVE",
      dateCreation: SEED_DATE,
      dateModification: SEED_DATE,
      creePar: SEED_AUTEUR_ID,
      modifiePar: SEED_AUTEUR_ID,
    },
    idBranche,
  ),
];

export const matieresLocalesSeed: MatiereLocale[] = [];

const idAnnee = id();
export const anneesSeed: AnneeAcademique[] = [
  AnneeAcademique.create(
    {
      libelle: "2025-2026",
      dateDebut: "2025-09-01",
      dateFin: "2026-07-31",
      etat: "EN_COURS",
      dateDemarrage: SEED_DATE,
      dateCloture: null,
      dateCreation: SEED_DATE,
      dateModification: SEED_DATE,
      creePar: SEED_AUTEUR_ID,
      modifiePar: SEED_AUTEUR_ID,
    },
    idAnnee,
  ),
];

const idConfiguration = id();
export const configurationsSeed: ConfigurationBrancheAnnee[] = [
  ConfigurationBrancheAnnee.create(
    {
      brancheId: idBranche,
      anneeAcademiqueId: idAnnee,
      etat: "OUVERTE",
      dupliqueeDepuisId: null,
      dateScellement: null,
      dateCreation: SEED_DATE,
      dateModification: SEED_DATE,
      creePar: SEED_AUTEUR_ID,
      modifiePar: SEED_AUTEUR_ID,
    },
    idConfiguration,
  ),
];

const filiereGen = filieresSeed.find((f) => f.code === "GEN")!;
export const filieresActivesSeed: FiliereActive[] = [
  FiliereActive.create(
    { configurationId: idConfiguration, filiereId: filiereGen.id, dateCreation: SEED_DATE, creePar: SEED_AUTEUR_ID },
    id(),
  ),
];

const niveauxCodes = ["6EME", "5EME", "4EME", "3EME", "2NDE", "1ERE", "TERM"] as const;
const niveauxRef = niveauxCodes.map((code) => niveauxSeed.find((n) => n.code === code)!);

export const niveauxActifsSeed: NiveauActive[] = niveauxRef.map((niveau) =>
  NiveauActive.create(
    { configurationId: idConfiguration, niveauId: niveau.id, dateCreation: SEED_DATE, creePar: SEED_AUTEUR_ID },
    id(),
  ),
);

const naParCode = new Map(niveauxCodes.map((code, index) => [code, niveauxActifsSeed[index]]));
const niveauRefParCode = new Map(niveauxCodes.map((code, index) => [code, niveauxRef[index]]));

const seriesCodes = ["A", "C", "D"] as const;
const seriesRef = seriesCodes.map(
  (code) => seriesSeed.find((s) => s.code === code && s.filiereId === filiereGen.id)!,
);

const niveauxAvecSerie = ["2NDE", "1ERE", "TERM"] as const;
export const seriesActivesSeed: SerieActive[] = niveauxAvecSerie.flatMap((code) => {
  const na = naParCode.get(code)!;
  return seriesRef.map((serie) =>
    SerieActive.create(
      { niveauActiveId: na.id, serieId: serie.id, dateCreation: SEED_DATE, creePar: SEED_AUTEUR_ID },
      id(),
    ),
  );
});

function serieActiveDe(niveauCode: (typeof niveauxAvecSerie)[number], serieCode: (typeof seriesCodes)[number]) {
  const na = naParCode.get(niveauCode)!;
  const serie = seriesRef.find((s) => s.code === serieCode)!;
  return seriesActivesSeed.find((sa) => sa.niveauActiveId === na.id && sa.serieId === serie.id)!;
}

const matiereMath = matieresReferentielSeed.find((m) => m.code === "MATH" && m.sousSystemeId === sousSystemeFr.id)!;
const matiereFr = matieresReferentielSeed.find((m) => m.code === "FR")!;
const matiereAng = matieresReferentielSeed.find((m) => m.code === "ANG")!;
const matierePc = matieresReferentielSeed.find((m) => m.code === "PC")!;
const matiereSvt = matieresReferentielSeed.find((m) => m.code === "SVT")!;
const matiereHistGeo = matieresReferentielSeed.find((m) => m.code === "HIST_GEO")!;
const matierePhilo = matieresReferentielSeed.find((m) => m.code === "PHILO")!;

export const matieresActivesSeed: MatiereActive[] = [];

function activerMatiere(
  niveauActiveId: string,
  matiereReferentielId: string,
  coefficient: number,
  serieActiveId?: string,
): void {
  matieresActivesSeed.push(
    MatiereActive.create(
      {
        niveauActiveId,
        serieActiveId,
        matiereReferentielId,
        coefficient,
        estObligatoire: true,
        dateCreation: SEED_DATE,
        dateModification: SEED_DATE,
        creePar: SEED_AUTEUR_ID,
        modifiePar: SEED_AUTEUR_ID,
      },
      id(),
    ),
  );
}

// Tronc commun : mathématiques, français, anglais sur tous les niveaux.
for (const code of niveauxCodes) {
  const na = naParCode.get(code)!;
  activerMatiere(na.id, matiereMath.id, code === "TERM" ? 3 : 4);
  activerMatiere(na.id, matiereFr.id, 4);
  activerMatiere(na.id, matiereAng.id, 2);
}

// Premier cycle (4ème/3ème) : physique-chimie et histoire-géo en tronc commun.
for (const code of ["4EME", "3EME"] as const) {
  const na = naParCode.get(code)!;
  activerMatiere(na.id, matierePc.id, 2);
  activerMatiere(na.id, matiereHistGeo.id, 2);
}

// Second cycle : coefficients différenciés par série (C : sciences fortes, D : SVT forte, A : lettres).
for (const code of niveauxAvecSerie) {
  const na = naParCode.get(code)!;
  activerMatiere(na.id, matiereHistGeo.id, 3, serieActiveDe(code, "A").id);
  activerMatiere(na.id, matierePhilo.id, code === "TERM" ? 4 : 2, serieActiveDe(code, "A").id);
  activerMatiere(na.id, matierePc.id, 6, serieActiveDe(code, "C").id);
  activerMatiere(na.id, matiereSvt.id, 2, serieActiveDe(code, "C").id);
  activerMatiere(na.id, matierePc.id, 2, serieActiveDe(code, "D").id);
  activerMatiere(na.id, matiereSvt.id, 6, serieActiveDe(code, "D").id);
}

export const classesSeed: Classe[] = [];

function creerClasse(
  niveauCode: (typeof niveauxCodes)[number],
  suffixe: string,
  serieActiveId?: string,
  serieCode?: string,
): void {
  const na = naParCode.get(niveauCode)!;
  const niveau = niveauRefParCode.get(niveauCode)!;
  const libelleComplet = serieCode
    ? `${niveau.libelle.fr} ${serieCode} ${suffixe}`
    : `${niveau.libelle.fr} ${suffixe}`;
  classesSeed.push(
    Classe.create(
      {
        configurationId: idConfiguration,
        niveauActiveId: na.id,
        serieActiveId,
        suffixe,
        libelleComplet,
        effectifPrevu: 45,
        actif: true,
        dateCreation: SEED_DATE,
        dateModification: SEED_DATE,
        creePar: SEED_AUTEUR_ID,
        modifiePar: SEED_AUTEUR_ID,
      },
      id(),
    ),
  );
}

creerClasse("6EME", "A");
creerClasse("6EME", "B");
creerClasse("5EME", "A");
creerClasse("4EME", "A");
creerClasse("3EME", "A");
creerClasse("3EME", "B");
creerClasse("2NDE", "A", serieActiveDe("2NDE", "C").id, "C");
creerClasse("TERM", "A", serieActiveDe("TERM", "C").id, "C");
creerClasse("TERM", "B", serieActiveDe("TERM", "C").id, "C");

export const auditSeed: AuditStructure[] = [
  AuditStructure.create(
    {
      operation: "CREATION",
      cibleType: "branche",
      cibleId: idBranche,
      utilisateurId: SEED_AUTEUR_ID,
      horodatage: SEED_DATE,
      valeursAvant: null,
      valeursApres: { libelle: "Francophone — Secondaire — Général" },
      motif: null,
    },
    id(),
  ),
  AuditStructure.create(
    {
      operation: "DEMARRAGE_ANNEE",
      cibleType: "annee_academique",
      cibleId: idAnnee,
      utilisateurId: SEED_AUTEUR_ID,
      horodatage: SEED_DATE,
      valeursAvant: null,
      valeursApres: { libelle: "2025-2026" },
      motif: null,
    },
    id(),
  ),
];
