import { DomainError } from "~/shared/domain/domain-error";
import type { EtatInscription } from "../shared/etat-inscription";

/** ELV-002 : inscription introuvable dans le périmètre de l'établissement. */
export class InscriptionIntrouvableError extends DomainError {
  readonly code = "ELV-002";
  constructor(inscriptionId: string) {
    super("Inscription introuvable.", { inscription_id: inscriptionId });
  }
}

/**
 * ELV-003 : une inscription ACTIVE existe déjà pour cet élève, cette
 * année (RM-E-05). Levée côté application (nécessite de consulter les
 * autres inscriptions de l'élève), définie ici pour rester avec les
 * autres erreurs du module.
 */
export class InscriptionActiveExistanteError extends DomainError {
  readonly code = "ELV-003";
  constructor(classeExistante: string, inscriptionIdExistante: string) {
    super(`Déjà inscrit en ${classeExistante}.`, {
      inscription_id: inscriptionIdExistante,
    });
  }
}

/** ELV-004 : classe cible inexistante, inactive, ou n'appartenant pas à la bonne année/établissement. */
export class ClasseIndisponibleError extends DomainError {
  readonly code = "ELV-004";
  constructor() {
    super("Cette classe n'est pas disponible.");
  }
}

/** ELV-005 : toute action d'écriture sur une année clôturée. */
export class AnneeClotureeError extends DomainError {
  readonly code = "ELV-005";
  constructor(libelleAnnee: string) {
    super(`L'année ${libelleAnnee} est clôturée : plus aucune modification.`, {
      libelle_annee: libelleAnnee,
    });
  }
}

/** ELV-008 : mutation ou clôture tentée sur une inscription non ACTIVE. */
export class InscriptionNonActiveError extends DomainError {
  readonly code = "ELV-008";
  constructor(etatActuel: EtatInscription) {
    super("Cette inscription est déjà close.", { etat_actuel: etatActuel });
  }
}

/** ELV-009 : réactivation demandée alors que l'année est déjà clôturée. */
export class ReactivationAnneeClotureeError extends DomainError {
  readonly code = "ELV-009";
  constructor() {
    super("L'année est clôturée : la réactivation n'est plus possible.");
  }
}

/** ELV-012 : mutation vers la classe d'origine — l'élève y est déjà. */
export class MutationVersClasseOrigineError extends DomainError {
  readonly code = "ELV-012";
  constructor() {
    super("L'élève est déjà dans cette classe.");
  }
}

/** ELV-013 : motif absent sur une action qui l'exige (mutation, départ, exclusion, réactivation). */
export class MotifObligatoireError extends DomainError {
  readonly code = "ELV-013";
  constructor() {
    super("Un motif est requis pour cette action.");
  }
}