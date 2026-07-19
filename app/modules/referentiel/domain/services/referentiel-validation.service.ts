import type { EtatReferentiel } from "~/modules/referentiel/domain/shared/etat-referentiel";
import {
  DepreciationSansMotifError,
  IncoherenceCreationSerieError,
  IncoherenceOrdreEnseignementError,
  IncoherenceSousSystemeError,
  ReferenceParentDeprecieError,
  SerieAppliqueeTropTotError,
} from "~/modules/referentiel/domain/errors/referentiel.errors";

/**
 * Port direct du pseudo-code de la section 4.2 du dossier d'implémentation.
 * Fonctions pures : le "chargement" des entités référencées (charger(id))
 * reste à la charge de l'appelant (le repository, qui a accès aux stores),
 * ce service ne fait que juger des données déjà chargées.
 */

export interface PositionGlobale {
  rangCycle: number;
  rangDansCycle: number;
}

function positionEstAnterieure(a: PositionGlobale, b: PositionGlobale): boolean {
  if (a.rangCycle !== b.rangCycle) return a.rangCycle < b.rangCycle;
  return a.rangDansCycle < b.rangDansCycle;
}

export const ReferentielValidationService = {
  /** REF-011 : le niveau d'apparition d'une série doit appartenir au même ordre d'enseignement que sa filière. */
  validerCreationSerie(params: {
    filiereOrdreEnseignementId: string;
    cycleApparitionOrdreEnseignementId: string;
  }): void {
    if (
      params.filiereOrdreEnseignementId !==
      params.cycleApparitionOrdreEnseignementId
    ) {
      throw new IncoherenceCreationSerieError({
        filiere_ordre_enseignement: params.filiereOrdreEnseignementId,
        cycle_apparition_ordre_enseignement:
          params.cycleApparitionOrdreEnseignementId,
      });
    }
  },

  /** REF-002 / REF-003 / REF-004 : cohérence matière ↔ niveau ↔ série cible. */
  validerMatiereReferentielNiveau(params: {
    matiereSousSystemeId: string;
    cycleSousSystemeId: string;
    niveauPosition: PositionGlobale;
    cycleOrdreEnseignementId: string;
    serieApparitionPosition?: PositionGlobale;
    serieOrdreEnseignementId?: string;
  }): void {
    if (params.matiereSousSystemeId !== params.cycleSousSystemeId) {
      throw new IncoherenceSousSystemeError({
        matiere_sous_systeme: params.matiereSousSystemeId,
        niveau_sous_systeme: params.cycleSousSystemeId,
      });
    }

    if (params.serieApparitionPosition) {
      if (
        positionEstAnterieure(
          params.niveauPosition,
          params.serieApparitionPosition,
        )
      ) {
        throw new SerieAppliqueeTropTotError();
      }
      if (params.serieOrdreEnseignementId !== params.cycleOrdreEnseignementId) {
        throw new IncoherenceOrdreEnseignementError({
          serie_ordre_enseignement: params.serieOrdreEnseignementId,
          cycle_ordre_enseignement: params.cycleOrdreEnseignementId,
        });
      }
    }
  },

  /** REF-006 : une création ne peut référencer un parent déprécié. */
  validerParentActif(
    parent: { etat: EtatReferentiel } | null | undefined,
    libelleParent: string,
  ): void {
    if (parent && parent.etat === "DEPRECATED") {
      throw new ReferenceParentDeprecieError(libelleParent);
    }
  },

  /** REF-005 : le motif est obligatoire pour déprécier (REF-012, l'idempotence, est gérée par le repository). */
  validerMotifDepreciation(motif: string): void {
    if (!motif.trim()) {
      throw new DepreciationSansMotifError();
    }
  },
};
