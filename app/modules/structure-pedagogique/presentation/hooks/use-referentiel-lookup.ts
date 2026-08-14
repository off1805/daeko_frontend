import {
  filiereQueries,
  matiereReferentielQueries,
  niveauQueries,
  serieQueries,
  type FiliereDto,
  type MatiereReferentielDto,
  type NiveauDto,
  type SerieDto,
} from "~/modules/referentiel/presentation"

/**
 * Résolution des libellés référentiel (niveau, série, filière, matière)
 * pour l'affichage — la couche application de structure-pédagogique reste
 * volontairement en IDs bruts (voir structure-read.dto.ts), c'est ici,
 * côté présentation, que le référentiel est consulté via son barrel.
 */
export function useReferentielLookup() {
  const niveaux = niveauQueries.useList({ etat: "TOUS", taille: 200 })
  const series = serieQueries.useList({ etat: "TOUS", taille: 200 })
  const filieres = filiereQueries.useList({ etat: "TOUS", taille: 200 })
  const matieres = matiereReferentielQueries.useList({ etat: "TOUS", taille: 200 })

  const niveauById = new Map<string, NiveauDto>((niveaux.data?.donnees ?? []).map((n) => [n.id, n]))
  const serieById = new Map<string, SerieDto>((series.data?.donnees ?? []).map((s) => [s.id, s]))
  const filiereById = new Map<string, FiliereDto>((filieres.data?.donnees ?? []).map((f) => [f.id, f]))
  const matiereById = new Map<string, MatiereReferentielDto>(
    (matieres.data?.donnees ?? []).map((m) => [m.id, m]),
  )

  return {
    isLoading: niveaux.isLoading || series.isLoading || filieres.isLoading || matieres.isLoading,
    niveaux: niveaux.data?.donnees ?? [],
    series: series.data?.donnees ?? [],
    filieres: filieres.data?.donnees ?? [],
    matieres: matieres.data?.donnees ?? [],
    niveauById,
    serieById,
    filiereById,
    matiereById,
  }
}
