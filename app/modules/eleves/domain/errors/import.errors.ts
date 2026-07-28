import { DomainError } from "~/shared/domain/domain-error";
import type { StatutImportLot } from "../shared/statut-import-lot";

/** ELV-011 : fichier illisible, vide, ou correspondance incomplète des champs obligatoires. */
export class CorrespondanceIncompleteError extends DomainError {
  readonly code = "ELV-011";
  constructor(champsManquants: readonly string[]) {
    super(
      `Le fichier ne peut pas être traité : champ(s) obligatoire(s) non couvert(s) (${champsManquants.join(", ")}).`,
      { champs_manquants: champsManquants }
    );
  }
}

/** ELV-011 également : lot introuvable en statut PREVISUALISE au moment de l'exécution. */
export class TransitionImportInvalideError extends DomainError {
  readonly code = "ELV-011";
  constructor(statutActuel: StatutImportLot, statutsAttendus: StatutImportLot[]) {
    super(
      `Cette action n'est pas possible dans l'état actuel du lot (${statutActuel}).`,
      { statut_actuel: statutActuel, statuts_attendus: statutsAttendus }
    );
  }
}

/**
 * Pas un code ELV officiel du dossier (règle interne de cohérence,
 * garde-fou technique plutôt qu'un rejet métier visible à l'écran).
 */
export class LigneDejaTraiteeError extends DomainError {
  readonly code = "ELV-011";
  constructor(numeroLigne: number) {
    super(`La ligne ${numeroLigne} a déjà été traitée.`, { numero_ligne: numeroLigne });
  }
}