// Point d'entrée public du module Établissement
export * from './components/EtablissementPortfolioSection';
export * from './components/FicheIdentiteSection';
export * from './components/LocalisationSection';
export * from './components/EditeurEnTeteSection';
export * from './components/SignatairesSection';
export * from './components/HistoriqueEtablissementSection';
export * from './nav';

// Exportation des conteneurs et use-cases pour la liaison directe
export { etablissementContainer } from '~/modules/etablissement/infrastructure/etablissement.container';