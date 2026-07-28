import { DomainError } from "~/shared/domain/domain-error";

/** ELV-001 : matricule déjà présent dans l'établissement (§4.1, table des erreurs). */
export class MatriculeDejaExistantError extends DomainError {
  readonly code = "ELV-001";
  constructor(nomEleveExistant: string, classeExistante: string, eleveIdExistant: string) {
    super(`Ce matricule appartient déjà à ${nomEleveExistant}, ${classeExistante}.`, {
      eleve_id: eleveIdExistant,
      classe: classeExistante,
    });
  }
}

/** ELV-002 : fiche, tuteur ou inscription introuvable dans le périmètre de l'établissement. */
export class EleveIntrouvableError extends DomainError {
  readonly code = "ELV-002";
  constructor(eleveId: string) {
    super("Élève introuvable.", { eleve_id: eleveId });
  }
}

export class TuteurIntrouvableError extends DomainError {
  readonly code = "ELV-002";
  constructor(tuteurId: string) {
    super("Tuteur introuvable.", { tuteur_id: tuteurId });
  }
}

/** ELV-006 : la fiche se retrouverait sans tuteur, sans téléphone, ou sans contact principal. */
export class AucunTuteurError extends DomainError {
  readonly code = "ELV-006";
  constructor() {
    super("Au moins un tuteur avec téléphone est requis, dont un contact principal.");
  }
}

export class AucunContactPrincipalError extends DomainError {
  readonly code = "ELV-006";
  constructor() {
    super("Un contact principal doit être désigné parmi les tuteurs.");
  }
}

/** ELV-007 : suppression d'une fiche portant au moins une inscription — interdite, elle s'archive. */
export class EleveAvecInscriptionError extends DomainError {
  readonly code = "ELV-007";
  constructor() {
    super("Cette fiche a un historique : elle s'archive, elle ne se supprime pas.");
  }
}

/** ELV-014 : suppression du dernier tuteur, ou du principal sans remplaçant désigné. */
export class DernierTuteurPrincipalError extends DomainError {
  readonly code = "ELV-014";
  constructor() {
    super("Désignez d'abord un autre contact principal.");
  }
}