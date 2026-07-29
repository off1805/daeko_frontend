// Point d'entrée public du module Établissement
export * from './components/sections/portefeuille-section';
export * from './components/sections/fiche-identite-section';
export * from './components/sections/localisation-section';
export * from './components/sections/en-tete-section';
export * from './components/sections/signataires-section';
export * from './components/sections/historique-section';
export * from './components/sections/etablissement-sidebar';
export * from './nav';

// Exportation des conteneurs et use-cases pour la liaison directe
export { etablissementContainer } from '~/modules/etablissement/infrastructure/etablissement.container';