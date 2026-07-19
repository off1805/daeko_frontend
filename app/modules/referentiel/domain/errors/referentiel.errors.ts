import { DomainError } from "~/shared/domain/domain-error";

/**
 * Catalogue des codes d'erreur du module Référentiel (dossier section 4.1).
 * REF-012 n'est pas une erreur : une re-dépréciation est un no-op à 200,
 * voir REF_012_DEJA_DEPRECIEE plus bas et son traitement dans le
 * repository (retourne l'entrée existante sans lever d'exception).
 */

export class ViolationUniciteError extends DomainError {
  readonly code = "REF-001";
  readonly httpStatus = 409;

  constructor(champ: string, valeur: string) {
    super(
      `La valeur "${valeur}" du champ "${champ}" est déjà utilisée dans ce périmètre.`,
      { champ, valeur },
    );
  }
}

export class IncoherenceSousSystemeError extends DomainError {
  readonly code = "REF-002";
  readonly httpStatus = 422;

  constructor(details?: Record<string, unknown>) {
    super(
      "La matière et le niveau cible n'appartiennent pas au même sous-système.",
      details,
    );
  }
}

export class SerieAppliqueeTropTotError extends DomainError {
  readonly code = "REF-003";
  readonly httpStatus = 422;

  constructor(details?: Record<string, unknown>) {
    super(
      "Le niveau cible est antérieur au niveau d'apparition de la série.",
      details,
    );
  }
}

export class IncoherenceOrdreEnseignementError extends DomainError {
  readonly code = "REF-004";
  readonly httpStatus = 422;

  constructor(details?: Record<string, unknown>) {
    super(
      "La filière de la série et le cycle du niveau cible ne portent pas le même ordre d'enseignement.",
      details,
    );
  }
}

export class DepreciationSansMotifError extends DomainError {
  readonly code = "REF-005";
  readonly httpStatus = 422;

  constructor() {
    super("Le motif de dépréciation est obligatoire.");
  }
}

export class ReferenceParentDeprecieError extends DomainError {
  readonly code = "REF-006";
  readonly httpStatus = 422;

  constructor(libelleParent: string) {
    super(`La référence parente "${libelleParent}" est dépréciée.`, {
      parent: libelleParent,
    });
  }
}

export class SuppressionPhysiqueInterditeError extends DomainError {
  readonly code = "REF-007";
  readonly httpStatus = 405;

  constructor() {
    super(
      "La suppression physique n'existe pas dans ce module : utiliser la dépréciation.",
    );
  }
}

export class ModificationReferenceStructurelleInterditeError extends DomainError {
  readonly code = "REF-008";
  readonly httpStatus = 422;

  constructor(champ: string) {
    super(
      `Le champ "${champ}" est une référence structurelle : non modifiable hors procédure exceptionnelle.`,
      { champ },
    );
  }
}

export class RoleInsuffisantError extends DomainError {
  readonly code = "REF-009";
  readonly httpStatus = 403;

  constructor() {
    super("Seul le rôle SUPER_ADMIN peut écrire dans le référentiel.");
  }
}

export class EntreeIntrouvableError extends DomainError {
  readonly code = "REF-010";
  readonly httpStatus = 404;

  constructor(id: string) {
    super(`Entrée introuvable : "${id}".`, { id });
  }
}

export class IncoherenceCreationSerieError extends DomainError {
  readonly code = "REF-011";
  readonly httpStatus = 422;

  constructor(details?: Record<string, unknown>) {
    super(
      "Le niveau d'apparition de la série appartient à un cycle dont l'ordre d'enseignement diffère de celui de la filière.",
      details,
    );
  }
}

/** REF-012 : dépréciation déjà effective — réponse informative 200, pas une exception. */
export const REF_012_DEJA_DEPRECIEE = "REF-012";
