/**
 * Écriture réservée à SUPER_ADMIN (doc section 1.1, 6.3) : le rôle est
 * porté par le jeton d'authentification. Le module Identité & Accès n'est
 * pas encore câblé côté frontend — cet identifiant tient lieu d'auteur
 * courant pour les mutations (audit `cree_par` / `modifie_par`) en
 * attendant le branchement d'une session réelle.
 */
export const REFERENTIEL_AUTEUR_ID = "00000000-0000-4000-9000-000000000001"
