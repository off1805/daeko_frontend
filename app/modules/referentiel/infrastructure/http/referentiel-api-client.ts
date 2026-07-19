import axios from "axios";

/**
 * Client axios du module Référentiel (doc section 2 : préfixe
 * /api/v1/referentiel, JWT porté en amont). Pas encore consommé : tant que
 * le backend n'existe pas, les repositories utilisent des données mockées
 * (voir infrastructure/repositories/in-memory-referentiel.repository.ts).
 * Un futur Http<Entité>Repository appellera cette instance et convertira
 * le JSON snake_case de l'API vers les entités de domaine (camelCase).
 */
export const referentielApiClient = axios.create({
  baseURL: "/api/v1/referentiel",
  headers: {
    "Content-Type": "application/json",
  },
});

// Injection du jeton d'authentification, une fois le module Identité & Accès
// disponible côté frontend :
// referentielApiClient.interceptors.request.use((config) => {
//   const token = getAuthToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });
