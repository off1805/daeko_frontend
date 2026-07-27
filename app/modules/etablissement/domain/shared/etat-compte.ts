/**
 * Les 5 états possibles d'un compte établissement sur la plateforme (CU-04, CU-05).
 */
export type EtatCompte = 
  | 'EN_CREATION'
  | 'EN_ESSAI'
  | 'ACTIF'
  | 'SUSPENDU'
  | 'ARCHIVE';

/**
 * Matrice des transitions d'état autorisées par les règles métier (RM-02, RM-09, RM-10).
 */
export const TRANSITIONS_ETAT_VALIDES: Record<EtatCompte, EtatCompte[]> = {
  EN_CREATION: ['EN_ESSAI', 'ACTIF', 'ARCHIVE'],
  EN_ESSAI: ['ACTIF', 'SUSPENDU', 'ARCHIVE'],
  ACTIF: ['SUSPENDU', 'ARCHIVE'],
  SUSPENDU: ['ACTIF', 'ARCHIVE'],
  ARCHIVE: [] // Un compte archivé ne peut plus changer d'état (définitif)
};

/**
 * Vérifie si le passage d'un état source vers un état cible est permis.
 */
export function estTransitionValide(actuel: EtatCompte, cible: EtatCompte): boolean {
  return TRANSITIONS_ETAT_VALIDES[actuel]?.includes(cible) ?? false;
}