/**
 * Statuts juridiques officiels pris en charge par la plateforme.
 */
export type StatutJuridique =
  | 'PUBLIC'
  | 'PRIVE_LAIC'
  | 'PRIVE_CATHOLIQUE'
  | 'PRIVE_PROTESTANT'
  | 'PRIVE_ISLAMIQUE';

/**
 * Libellés affichables dans l'interface utilisateur (UX / P2).
 */
export const STATUT_JURIDIQUE_LABELS: Record<StatutJuridique, string> = {
  PUBLIC: 'Public',
  PRIVE_LAIC: 'Privé Laïc',
  PRIVE_CATHOLIQUE: 'Privé Confessionnel Catholique',
  PRIVE_PROTESTANT: 'Privé Confessionnel Protestant',
  PRIVE_ISLAMIQUE: 'Privé Confessionnel Islamique',
};

/**
 * Indique si le statut juridique nécessite la saisie d'un numéro d'agrément (RM-02).
 */
export function estStatutPrive(statut: StatutJuridique): boolean {
  return statut !== 'PUBLIC';
}