import { Eleve } from "../../domain/entities/eleve.entity";
import { Tuteur } from "../../domain/entities/tuteur.entity";
import { Inscription } from "../../domain/entities/inscription.entity";
import { Identite } from "../../domain/shared/identite.vo";

const ETABLISSEMENT_DEMO_ID = "etablissement-demo-001";
const ANNEE_ACADEMIQUE_DEMO_ID = "annee-2025-2026";
const CLASSE_3EME_A_ID = "classe-3eme-a";
const CLASSE_4EME_B_ID = "classe-4eme-b";

function creerTuteur(
  id: string,
  eleveId: string,
  nom: string,
  telephone: string
): Tuteur {
  return Tuteur.reconstruct(id, {
    eleveId,
    nom,
    lienParente: "PERE",
    telephone,
    estContactPrincipal: true,
  });
}

/** Trois fiches élèves de démonstration, avec leurs tuteurs (dossier fonctionnel §3.1, §3.2). */
export const elevesSeed: Eleve[] = [
  Eleve.reconstruct("eleve-001", {
    etablissementId: ETABLISSEMENT_DEMO_ID,
    matricule: "MAT-2025-001",
    identite: Identite.create({
      nom: "NGONO",
      prenoms: "Marie Claire",
      sexe: "F",
      dateNaissance: "2011-03-14",
      lieuNaissance: "Yaoundé",
    }),
    etat: "ACTIF",
    tuteurs: [creerTuteur("tuteur-001", "eleve-001", "NGONO Paul", "699001122")],
    dateCreation: "2025-09-01T08:00:00.000Z",
    dateModification: "2025-09-01T08:00:00.000Z",
  }),

  Eleve.reconstruct("eleve-002", {
    etablissementId: ETABLISSEMENT_DEMO_ID,
    matricule: "MAT-2025-002",
    identite: Identite.create({
      nom: "MBALLA",
      prenoms: "Jean Baptiste",
      sexe: "M",
      dateNaissance: "2010-11-02",
      lieuNaissance: "Douala",
    }),
    etat: "ACTIF",
    tuteurs: [creerTuteur("tuteur-002", "eleve-002", "MBALLA Suzanne", "677223344")],
    dateCreation: "2025-09-01T08:05:00.000Z",
    dateModification: "2025-09-01T08:05:00.000Z",
  }),

  Eleve.reconstruct("eleve-003", {
    etablissementId: ETABLISSEMENT_DEMO_ID,
    matricule: "MAT-2025-003",
    identite: Identite.create({
      nom: "FOTSO",
      prenoms: "Divine",
      sexe: "F",
      dateNaissance: "2011-07-22",
    }),
    etat: "ARCHIVE", // exemple de fiche archivée, pour tester le filtre etat
    tuteurs: [creerTuteur("tuteur-003", "eleve-003", "FOTSO André", "655334455")],
    dateCreation: "2024-09-01T08:00:00.000Z",
    dateModification: "2025-06-15T10:00:00.000Z",
  }),
];

/** Deux inscriptions actives, une avec une mutation dans son historique (dossier technique §2.3, §2.4). */
export const inscriptionsSeed: Inscription[] = [
  Inscription.reconstruct("inscription-001", {
    etablissementId: ETABLISSEMENT_DEMO_ID,
    eleveId: "eleve-001",
    classeId: CLASSE_3EME_A_ID,
    anneeAcademiqueId: ANNEE_ACADEMIQUE_DEMO_ID,
    numeroOrdre: 1,
    etat: "ACTIVE",
    dateInscription: "2025-09-01T08:00:00.000Z",
    dateCloture: null,
    motifCloture: null,
    mutations: [],
    dateCreation: "2025-09-01T08:00:00.000Z",
    dateModification: "2025-09-01T08:00:00.000Z",
  }),

  Inscription.reconstruct("inscription-002", {
    etablissementId: ETABLISSEMENT_DEMO_ID,
    eleveId: "eleve-002",
    classeId: CLASSE_3EME_A_ID,
    anneeAcademiqueId: ANNEE_ACADEMIQUE_DEMO_ID,
    numeroOrdre: 2,
    etat: "ACTIVE",
    dateInscription: "2025-09-01T08:05:00.000Z",
    dateCloture: null,
    motifCloture: null,
    mutations: [],
    dateCreation: "2025-09-01T08:05:00.000Z",
    dateModification: "2025-09-01T08:05:00.000Z",
  }),
];

export const IDS_DEMO = {
  etablissementId: ETABLISSEMENT_DEMO_ID,
  anneeAcademiqueId: ANNEE_ACADEMIQUE_DEMO_ID,
  classe3emeA: CLASSE_3EME_A_ID,
  classe4emeB: CLASSE_4EME_B_ID,
};