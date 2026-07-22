import { DomainError } from "~/shared/domain/domain-error";
import type { EtatCompteEtablissement } from "../shared/etat-compte-etablissement";



/** RM-03 : un établissement identique (nom + arrondissement + ville) existe déjà. CU-01, E1. */
export class EtablissementDoublonError extends DomainError {
  readonly code = "ETB-001";
  constructor(nomOfficiel: string) {
    super(`Un établissement "${nomOfficiel}" existe déjà dans cet arrondissement et cette ville.`, {
      nomOfficiel,
    });
  }
}

/** RM-08, CU-04 E1 : activation refusée, liste EXACTE de ce qui manque — jamais un refus vague. */
export class ActivationRefuseeError extends DomainError {
  readonly code = "ETB-002";
  constructor(elementsManquants: string[]) {
    super(
      `Activation impossible : ${elementsManquants.join(", ")} manquant(s).`,
      { elementsManquants }
    );
  }
}

/** RM-09, CU-05 E1 : suspension sans motif — impossible. */
export class SuspensionSansMotifError extends DomainError {
  readonly code = "ETB-003";
  constructor() {
    super("Un motif est obligatoire pour suspendre un établissement.");
  }
}

/** RM-10 : archivage sans motif — impossible, même logique que la suspension. */
export class ArchivageSansMotifError extends DomainError {
  readonly code = "ETB-004";
  constructor() {
    super("Un motif est obligatoire pour archiver un établissement.");
  }
}

/** Transition de cycle de vie non autorisée (ex : activer un compte déjà archivé). */
export class TransitionEtatInvalideError extends DomainError {
  readonly code = "ETB-005";
  constructor(etatActuel: EtatCompteEtablissement, etatVise: EtatCompteEtablissement) {
    super(`Impossible de passer de l'état ${etatActuel} à ${etatVise}.`, {
      etatActuel,
      etatVise,
    });
  }
}

/** Le signataire référencé n'existe pas sur cet établissement. */
export class SignataireIntrouvableError extends DomainError {
  readonly code = "ETB-006";
  constructor(signataireId: string) {
    super(`Signataire introuvable : ${signataireId}.`, { signataireId });
  }
}

/** RM-06 : passage en mode SIMPLE ou BILINGUE avec des lignes incomplètes. */
export class EnteteIncompletError extends DomainError {
  readonly code = "ETB-007";
  constructor(ordresLignes: number[], versionManquante: "française" | "anglaise") {
    super(
      `Version ${versionManquante} manquante sur la/les ligne(s) d'ordre ${ordresLignes.join(", ")}.`,
      { ordresLignes, versionManquante }
    );
  }
}

/** 2.2 : le numéro d'agrément est obligatoire pour tout établissement privé. */
export class AgrementManquantError extends DomainError {
  readonly code = "ETB-008";
  constructor() {
    super("Le numéro d'agrément est obligatoire pour un établissement privé.");
  }
}