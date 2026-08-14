import { DomainError } from "~/shared/domain/domain-error";

/**
 * Catalogue des codes d'erreur du module Structure Pédagogique (dossier
 * section 4.1). SP-021/023 (suspension établissement, permissions IAM)
 * restent hors périmètre : aucun module Établissement/IAM n'est simulé
 * côté mock. Le reste (scellement, verrouillage de coefficient, matrice
 * 4.6) est maintenant couvert — voir in-memory-configuration.repository.ts.
 */

export class BrancheDupliqueeError extends DomainError {
  readonly code = "SP-001";
  readonly httpStatus = 409;

  constructor() {
    super(
      "Une branche existe déjà pour ce triplet (sous-système, ordre, type d'enseignement).",
    );
  }
}

export class IncoherenceSousSystemeError extends DomainError {
  readonly code = "SP-002";
  readonly httpStatus = 422;

  constructor(details?: Record<string, unknown>) {
    super(
      "Le sous-système de l'élément ne correspond pas à celui de la branche.",
      details,
    );
  }
}

export class IncoherenceOrdreEnseignementError extends DomainError {
  readonly code = "SP-003";
  readonly httpStatus = 422;

  constructor(details?: Record<string, unknown>) {
    super(
      "L'ordre d'enseignement de l'élément ne correspond pas à celui de la branche.",
      details,
    );
  }
}

export class IncoherenceTypeEnseignementError extends DomainError {
  readonly code = "SP-004";
  readonly httpStatus = 422;

  constructor(details?: Record<string, unknown>) {
    super(
      "Le type d'enseignement de l'élément ne correspond pas à celui de la branche.",
      details,
    );
  }
}

export class SerieActiveeTropTotError extends DomainError {
  readonly code = "SP-005";
  readonly httpStatus = 422;

  constructor(details?: Record<string, unknown>) {
    super(
      "Cette série ne peut pas être activée sur ce niveau : elle apparaît plus tard dans le cursus.",
      details,
    );
  }
}

export class FiliereNonActiveError extends DomainError {
  readonly code = "SP-006";
  readonly httpStatus = 422;

  constructor() {
    super(
      "La filière de cette série n'est pas activée dans cette configuration.",
    );
  }
}

export class ElementHorsPerimetreError extends DomainError {
  readonly code = "SP-007";
  readonly httpStatus = 422;

  constructor(details?: Record<string, unknown>) {
    super(
      "Cet élément fait référence à un niveau ou une série non activé dans cette configuration.",
      details,
    );
  }
}

export class PolymorphismeMatiereViolationError extends DomainError {
  readonly code = "SP-008";
  readonly httpStatus = 422;

  constructor() {
    super(
      "Une matière active doit référencer exactement une source : le référentiel ou une matière locale.",
    );
  }
}

export class MatiereLocaleAutreBrancheError extends DomainError {
  readonly code = "SP-009";
  readonly httpStatus = 422;

  constructor() {
    super("Cette matière locale appartient à une autre branche.");
  }
}

export class CoefficientInvalideError extends DomainError {
  readonly code = "SP-010";
  readonly httpStatus = 422;

  constructor() {
    super("Le coefficient doit être strictement positif.");
  }
}

export class DoublonActivationError extends DomainError {
  readonly code = "SP-011";
  readonly httpStatus = 409;

  constructor() {
    super("Cet élément est déjà activé dans ce périmètre.");
  }
}

export class CycleAnneeInvalideError extends DomainError {
  readonly code = "SP-012";
  readonly httpStatus = 422;

  constructor(message: string, details?: Record<string, unknown>) {
    super(message, details);
  }
}

export class TransitionInterditeError extends DomainError {
  readonly code = "SP-013";
  readonly httpStatus = 422;

  constructor(entite: string, de: string, vers: string) {
    super(`Transition interdite pour ${entite} : "${de}" → "${vers}".`, {
      entite,
      de,
      vers,
    });
  }
}

export class DuplicationImpossibleError extends DomainError {
  readonly code = "SP-015";
  readonly httpStatus = 422;

  constructor() {
    super(
      "Aucune configuration source n'existe pour cette branche sur l'année précédente demandée.",
    );
  }
}

export class ClasseDupliqueeError extends DomainError {
  readonly code = "SP-016";
  readonly httpStatus = 409;

  constructor(suffixe: string) {
    super(`Le suffixe "${suffixe}" est déjà utilisé pour ce niveau/série.`, {
      suffixe,
    });
  }
}

export class ClasseIncoherenteError extends DomainError {
  readonly code = "SP-017";
  readonly httpStatus = 422;

  constructor(message: string) {
    super(message);
  }
}

export class BrancheNonActiveError extends DomainError {
  readonly code = "SP-018";
  readonly httpStatus = 422;

  constructor() {
    super(
      "Impossible de créer une configuration sur une branche qui n'est pas ACTIVE.",
    );
  }
}

export class ReferenceStructurelleImmuableError extends DomainError {
  readonly code = "SP-019";
  readonly httpStatus = 422;

  constructor(champ: string) {
    super(`Le champ "${champ}" est une référence structurelle immuable.`, {
      champ,
    });
  }
}

export class ReferentielDeprecieError extends DomainError {
  readonly code = "SP-020";
  readonly httpStatus = 422;

  constructor(libelleParent: string) {
    super(
      `"${libelleParent}" est déprécié dans le référentiel et ne peut pas être activé dans une nouvelle configuration.`,
      { parent: libelleParent },
    );
  }
}

export class ConfigurationScelleeError extends DomainError {
  readonly code = "SP-014";
  readonly httpStatus = 422;

  constructor() {
    super("Cette configuration est scellée : toute écriture est refusée.");
  }
}

export class CoefficientVerrouilleError extends DomainError {
  readonly code = "SP-022";
  readonly httpStatus = 422;

  constructor() {
    super(
      "Le coefficient est verrouillé tant que l'année est en cours : passez par la correction ponctuelle (motif obligatoire).",
    );
  }
}

/**
 * Matrice des droits d'écriture selon l'état de l'année (doc 4.6) : en
 * EN_COURS, le retrait de filières/niveaux/séries/matières est refusé
 * ("des données aval peuvent en dépendre") — règle explicite du dossier
 * mais sans code SP individuel dans le catalogue 4.1, d'où ce code
 * synthétique local plutôt qu'un numéro inventé.
 */
export class RetraitInterditEnCoursError extends DomainError {
  readonly code = "SP-MATRICE-4.6";
  readonly httpStatus = 422;

  constructor() {
    super(
      "Le retrait n'est pas autorisé pendant que l'année est en cours (doc 4.6) : des données aval peuvent en dépendre.",
    );
  }
}

export class RessourceIntrouvableError extends DomainError {
  readonly code = "SP-024";
  readonly httpStatus = 404;

  constructor(id: string) {
    super(`Ressource introuvable : "${id}".`, { id });
  }
}

/**
 * Motif obligatoire pour un geste rare (archivage, désactivation de
 * classe, correction ponctuelle de coefficient) : exigé par le texte du
 * dossier à plusieurs endroits (5.1, 5.4, "Écritures en masse") mais sans
 * code SP dédié — regroupé ici plutôt que dupliqué par flux.
 */
export class MotifObligatoireError extends DomainError {
  readonly code = "SP-MOTIF";
  readonly httpStatus = 422;

  constructor() {
    super("Le motif est obligatoire pour cette action.");
  }
}
