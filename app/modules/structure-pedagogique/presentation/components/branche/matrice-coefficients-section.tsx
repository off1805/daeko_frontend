"use client"

import { PrinterIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { useReferentielLookup } from "~/modules/structure-pedagogique/presentation/hooks/use-referentiel-lookup"
import type { ConfigurationDetailDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface MatriceCoefficientsSectionProps {
  detail: ConfigurationDetailDto
}

interface Colonne {
  key: string
  label: string
  niveauActiveId: string
  serieActiveId?: string
}

/**
 * Vue de contrôle en lecture seule (doc GET /configurations/{id}/matrice-coefficients) :
 * tableau croisé matières × (niveau, série) avec coefficients effectifs —
 * "l'écran de relecture globale" identifié dans le dossier.
 */
export function MatriceCoefficientsSection({ detail }: MatriceCoefficientsSectionProps) {
  const lookup = useReferentielLookup()

  const colonnes: Colonne[] = detail.niveauxActifs.flatMap((na) => {
    const niveauLabel = lookup.niveauById.get(na.niveauId)?.libelleCourt ?? lookup.niveauById.get(na.niveauId)?.libelle ?? na.niveauId
    const seriesDuNiveau = detail.seriesActives.filter((s) => s.niveauActiveId === na.id)
    if (seriesDuNiveau.length === 0) {
      return [{ key: na.id, label: niveauLabel, niveauActiveId: na.id }]
    }
    // Un niveau avec séries garde une colonne "tronc commun" à part : une
    // matière sans série (vaut pour tout le niveau, doc 3.7) est une ligne
    // distincte de ses éventuelles variantes par série (TC-14), pas fondue
    // dans chaque colonne de série.
    return [
      { key: `${na.id}:tronc-commun`, label: `${niveauLabel} — tronc commun`, niveauActiveId: na.id },
      ...seriesDuNiveau.map((sa) => {
        const serie = lookup.serieById.get(sa.serieId)
        return {
          key: sa.id,
          label: `${niveauLabel} ${serie?.libelleCourt ?? serie?.code ?? ""}`.trim(),
          niveauActiveId: na.id,
          serieActiveId: sa.id,
        }
      }),
    ]
  })

  const matiereKey = (matiereReferentielId?: string, matiereLocaleId?: string) =>
    matiereReferentielId ? `ref:${matiereReferentielId}` : `loc:${matiereLocaleId}`

  const matiereLabelById = new Map<string, string>()
  for (const ma of detail.matieresActives) {
    const key = matiereKey(ma.matiereReferentielId, ma.matiereLocaleId)
    if (!matiereLabelById.has(key)) {
      matiereLabelById.set(
        key,
        ma.matiereReferentielId
          ? (lookup.matiereById.get(ma.matiereReferentielId)?.libelle ?? "Matière")
          : "Matière locale",
      )
    }
  }
  const lignes = Array.from(matiereLabelById.entries()).sort((a, b) => a[1].localeCompare(b[1]))

  function coefficientPour(matiereKeyValue: string, colonne: Colonne): number | null {
    const ma = detail.matieresActives.find((m) => {
      if (matiereKey(m.matiereReferentielId, m.matiereLocaleId) !== matiereKeyValue) return false
      if (m.niveauActiveId !== colonne.niveauActiveId) return false
      return colonne.serieActiveId ? m.serieActiveId === colonne.serieActiveId : !m.serieActiveId
    })
    return ma?.coefficient ?? null
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-foreground">Matrice des coefficients</h2>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <PrinterIcon />
          Imprimer
        </Button>
      </div>

      {colonnes.length === 0 || lignes.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          Rien à afficher tant qu'aucun niveau et aucune matière ne sont activés.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Matière</TableHead>
                {colonnes.map((colonne) => (
                  <TableHead key={colonne.key} className="text-center">
                    {colonne.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {lignes.map(([key, label]) => (
                <TableRow key={key} className="hover:bg-transparent">
                  <TableCell className="font-medium">{label}</TableCell>
                  {colonnes.map((colonne) => {
                    const coefficient = coefficientPour(key, colonne)
                    return (
                      <TableCell key={colonne.key} className="text-center tabular-nums">
                        {coefficient ?? <span className="text-muted-foreground">—</span>}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
