import type { EtatCompte } from '~/modules/etablissement/domain/shared/etat-compte';

/**
 * Classe de base pour toutes les erreurs métier du module Établissement.
 */
export abstract class BaseEtablissementError extends Error {
  public abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    // Maintient une trace d'empilement propre en V8 / TypeScript
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Erreur générique de validation des données d'un établissement.
 */
export class EtablissementValidationError extends BaseEtablissementError {
  public readonly code = 'ETB-000';

  constructor(message: string) {
    super(message);
  }
}

/**
 * ETB-001 : Doublon d'établissement (RM-03)
 * Un établissement existe déjà avec le même nom dans le même arrondissement et la même ville.
 */
export class EtablissementDoublonError extends BaseEtablissementError {
  public readonly code = 'ETB-001';

  constructor(nom: string, ville: string, arrondissementCode: string) {
    super(
      `Un établissement nommé "${nom}" existe déjà dans la ville de ${ville} (arrondissement : ${arrondissementCode}).`
    );
  }
}

/**
 * ETB-002 : Fiche incomplète lors d'une tentative d'activation (RM-08, CU-04)
 * L'activation exige la complétude préalable de la fiche.
 */
export class IncompletPourActivationError extends BaseEtablissementError {
  public readonly code = 'ETB-002';
  public readonly elementsManquants: string[];

  constructor(elementsManquants: string[]) {
    const details = elementsManquants.map((item) => `• ${item}`).join('\n');
    super(
      `Impossible d'activer l'établissement. Les éléments suivants sont obligatoires :\n${details}`
    );
    this.elementsManquants = elementsManquants;
  }
}

/**
 * ETB-003 : Traduction d'en-tête manquante en mode bilingue (RM-06, CU-02)
 * En mode bilingue, chaque ligne d'en-tête doit comporter sa version anglaise.
 */
export class LigneBilingueIncompleteError extends BaseEtablissementError {
  public readonly code = 'ETB-003';
  public readonly ligneOrdre: number;

  constructor(ligneOrdre: number) {
    super(
      `La ligne ${ligneOrdre} de l'en-tête ne possède pas de traduction anglaise. En mode bilingue, chaque ligne exige ses deux versions.`
    );
    this.ligneOrdre = ligneOrdre;
  }
}

/**
 * ETB-004 : Suspension ou archivage sans motif (RM-09, RM-10, CU-05)
 * Un motif explicite est obligatoirement requis pour geler ou archiver un compte.
 */
export class MotifObligatoireError extends BaseEtablissementError {
  public readonly code = 'ETB-004';
  public readonly action: EtatCompte;

  constructor(action: 'SUSPENDU' | 'ARCHIVE' | EtatCompte) {
    const libelleAction = action === 'SUSPENDU' ? 'la suspension' : 'l\'archivage';
    super(
      `Un motif explicite est obligatoirement requis pour confirmer ${libelleAction} du compte de l'établissement.`
    );
    this.action = action;
  }
}

/**
 * ETB-005 : Conflit de signataires principaux (RM-07, CU-03)
 * Garantit qu'un seul signataire principal est actif à la fois.
 */
export class MultipleSignatairesPrincipauxError extends BaseEtablissementError {
  public readonly code = 'ETB-005';

  constructor() {
    super(
      'Un seul signataire principal peut être actif à la fois. Veuillez désigner le nouveau principal pour effectuer la bascule automatique.'
    );
  }
}

/**
 * ETB-006 : Tentative de suppression physique d'un établissement (RM-11)
 * Rien ne se supprime dans le système : la suppression est interdite au profit de l'archivage.
 */
export class SuppressionEtablissementInterditeError extends BaseEtablissementError {
  public readonly code = 'ETB-006';

  constructor(id: string) {
    super(
      `La suppression physique de l'établissement (ID: ${id}) est strictement interdite. Utilisez la procédure d'archivage pour conserver la mémoire administrative.`
    );
  }
}