import {
  CoefficientInvalideError,
  ElementHorsPerimetreError,
  FiliereNonActiveError,
  IncoherenceOrdreEnseignementError,
  IncoherenceSousSystemeError,
  IncoherenceTypeEnseignementError,
  MatiereLocaleAutreBrancheError,
  ReferentielDeprecieError,
  SerieActiveeTropTotError,
} from "~/modules/structure-pedagogique/domain/errors/structure.errors";

/**
 * Port direct du pseudo-code de la section 4.2 du dossier. Fonctions
 * pures : la résolution des entités référentiel/structure (chargerX)
 * reste à la charge du repository (qui seul a accès aux stores et, pour
 * le référentiel, au container d'un autre module — voir ARCHITECTURE.md).
 * Même esprit que ReferentielValidationService côté module Référentiel.
 */

export interface PositionGlobale {
  rangCycle: number;
  rangDansCycle: number;
}

function positionEstAnterieure(a: PositionGlobale, b: PositionGlobale): boolean {
  if (a.rangCycle !== b.rangCycle) return a.rangCycle < b.rangCycle;
  return a.rangDansCycle < b.rangDansCycle;
}

export const StructureValidationService = {
  /** SP-002 / SP-003 / SP-020 : cohérence niveau ↔ branche. */
  validerNiveauActive(params: {
    niveauEstDeprecie: boolean;
    cycleSousSystemeId: string;
    cycleOrdreEnseignementId: string;
    brancheSousSystemeId: string;
    brancheOrdreEnseignementId: string;
  }): void {
    if (params.niveauEstDeprecie) {
      throw new ReferentielDeprecieError("niveau");
    }
    if (params.cycleSousSystemeId !== params.brancheSousSystemeId) {
      throw new IncoherenceSousSystemeError({
        cycle_sous_systeme: params.cycleSousSystemeId,
        branche_sous_systeme: params.brancheSousSystemeId,
      });
    }
    if (params.cycleOrdreEnseignementId !== params.brancheOrdreEnseignementId) {
      throw new IncoherenceOrdreEnseignementError({
        cycle_ordre_enseignement: params.cycleOrdreEnseignementId,
        branche_ordre_enseignement: params.brancheOrdreEnseignementId,
      });
    }
  },

  /** SP-003 / SP-004 / SP-020 : cohérence filière ↔ branche. */
  validerFiliereActive(params: {
    filiereEstDepreciee: boolean;
    filiereOrdreEnseignementId: string;
    filiereTypeEnseignementId: string;
    brancheOrdreEnseignementId: string;
    brancheTypeEnseignementId: string;
  }): void {
    if (params.filiereEstDepreciee) {
      throw new ReferentielDeprecieError("filière");
    }
    if (params.filiereOrdreEnseignementId !== params.brancheOrdreEnseignementId) {
      throw new IncoherenceOrdreEnseignementError({
        filiere_ordre_enseignement: params.filiereOrdreEnseignementId,
        branche_ordre_enseignement: params.brancheOrdreEnseignementId,
      });
    }
    if (params.filiereTypeEnseignementId !== params.brancheTypeEnseignementId) {
      throw new IncoherenceTypeEnseignementError({
        filiere_type_enseignement: params.filiereTypeEnseignementId,
        branche_type_enseignement: params.brancheTypeEnseignementId,
      });
    }
  },

  /** SP-005 / SP-006 / SP-020 : une série n'est activable que si sa filière l'est déjà et que le niveau cible n'est pas antérieur à son apparition. */
  validerSerieActive(params: {
    serieEstDepreciee: boolean;
    serieFiliereId: string;
    filieresActivesIds: string[];
    positionNiveauCible: PositionGlobale;
    positionNiveauApparition: PositionGlobale;
  }): void {
    if (params.serieEstDepreciee) {
      throw new ReferentielDeprecieError("série");
    }
    if (!params.filieresActivesIds.includes(params.serieFiliereId)) {
      throw new FiliereNonActiveError();
    }
    if (positionEstAnterieure(params.positionNiveauCible, params.positionNiveauApparition)) {
      throw new SerieActiveeTropTotError({
        niveau_demande: params.positionNiveauCible,
        niveau_apparition: params.positionNiveauApparition,
      });
    }
  },

  /** SP-002 / SP-007 / SP-009 / SP-010 / SP-020 : cohérence d'une matière active, quelle que soit sa source. */
  validerMatiereActive(params: {
    serieActiveIdRattacheeAuNiveau: boolean;
    coefficient: number;
    source:
      | { type: "referentiel"; estDepreciee: boolean; sousSystemeId: string; brancheSousSystemeId: string }
      | { type: "locale"; estDepreciee: boolean; brancheId: string; brancheIdCible: string };
  }): void {
    if (!params.serieActiveIdRattacheeAuNiveau) {
      throw new ElementHorsPerimetreError({ raison: "série non rattachée au niveau actif" });
    }
    if (params.source.type === "referentiel") {
      if (params.source.estDepreciee) {
        throw new ReferentielDeprecieError("matière");
      }
      if (params.source.sousSystemeId !== params.source.brancheSousSystemeId) {
        throw new IncoherenceSousSystemeError({
          matiere_sous_systeme: params.source.sousSystemeId,
          branche_sous_systeme: params.source.brancheSousSystemeId,
        });
      }
    } else {
      if (params.source.brancheId !== params.source.brancheIdCible) {
        throw new MatiereLocaleAutreBrancheError();
      }
      if (params.source.estDepreciee) {
        throw new ReferentielDeprecieError("matière locale");
      }
    }
    if (params.coefficient <= 0) {
      throw new CoefficientInvalideError();
    }
  },
};
