import { useQueries, useQuery } from "@tanstack/react-query";
import type {
  AuditFilters,
  PaginationParams,
} from "~/modules/referentiel/domain/repositories/referentiel.repository";
import { referentielContainer } from "~/modules/referentiel/infrastructure/referentiel.container";
import { createReferentielQueries } from "~/modules/referentiel/infrastructure/queries/create-referentiel-queries";

export const sousSystemeQueries = createReferentielQueries(
  "referentiel:sous-systemes",
  referentielContainer.sousSystemes,
);

export const ordreEnseignementQueries = createReferentielQueries(
  "referentiel:ordres-enseignement",
  referentielContainer.ordresEnseignement,
);

export const typeEnseignementQueries = createReferentielQueries(
  "referentiel:types-enseignement",
  referentielContainer.typesEnseignement,
);

export const cycleQueries = createReferentielQueries(
  "referentiel:cycles",
  referentielContainer.cycles,
);

export const niveauQueries = createReferentielQueries(
  "referentiel:niveaux",
  referentielContainer.niveaux,
);

export const filiereQueries = createReferentielQueries(
  "referentiel:filieres",
  referentielContainer.filieres,
);

export const serieQueries = createReferentielQueries(
  "referentiel:series",
  referentielContainer.series,
);

export const matiereReferentielQueries = createReferentielQueries(
  "referentiel:matieres",
  referentielContainer.matieresReferentiel,
);

export const matiereReferentielNiveauQueries = createReferentielQueries(
  "referentiel:matieres-niveaux",
  referentielContainer.matieresReferentielNiveau,
);

/**
 * GET /matieres-niveaux exige niveau_id (doc 5.1) : il n'existe pas
 * d'endpoint "toutes les affectations". Pour un écran de consultation
 * transverse (catalogue matières × niveaux), on interroge chaque niveau
 * en parallèle et on fusionne — la ressource reste filtrée par niveau à
 * la source, seule l'agrégation est nouvelle ici.
 */
export function useAllMatiereReferentielNiveauEntries() {
  const niveaux = niveauQueries.useList({ etat: "TOUS", taille: 200 });
  const niveauIds = niveaux.data?.donnees.map((niveau) => niveau.id) ?? [];

  const parNiveau = useQueries({
    queries: niveauIds.map((niveauId) => ({
      queryKey: [
        "referentiel:matieres-niveaux",
        "list",
        { niveauId, etat: "TOUS" as const },
      ],
      queryFn: () =>
        referentielContainer.matieresReferentielNiveau.listUseCase.execute({
          niveauId,
          etat: "TOUS",
          taille: 200,
        }),
    })),
  });

  return {
    isLoading: niveaux.isLoading || parNiveau.some((requete) => requete.isLoading),
    donnees: parNiveau.flatMap((requete) => requete.data?.donnees ?? []),
  };
}

/** /audit est en lecture seule (doc 5.1, 3.7) : pas de create/update/deprecier. */
export function useAuditEntries(filters: AuditFilters & PaginationParams) {
  return useQuery({
    queryKey: ["referentiel:audit", "list", filters],
    queryFn: () => referentielContainer.audit.listUseCase.execute(filters),
  });
}
