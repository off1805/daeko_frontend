"use client"

import * as React from "react"

import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import { getErrorMessage } from "~/shared/presentation/forms/form-field"
import { serieQueries } from "~/modules/referentiel/presentation"
import { useMettreAJourSeriesActives } from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import type { SerieActiveDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface SeriesPickerProps {
  niveauActiveId: string
  filiereIdsActives: string[]
  seriesActivesDuNiveau: SerieActiveDto[]
  disabled?: boolean
}

function memeEnsemble(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  const setB = new Set(b)
  return a.every((v) => setB.has(v))
}

/**
 * L'éligibilité fine d'une série (niveau d'apparition, SP-005/006) reste
 * validée côté domaine (StructureValidationService) plutôt que dupliquée
 * ici : le choix invalide est simplement refusé avec un message clair.
 */
export function SeriesPicker({
  niveauActiveId,
  filiereIdsActives,
  seriesActivesDuNiveau,
  disabled,
}: SeriesPickerProps) {
  const { data } = serieQueries.useList({ etat: "TOUS", taille: 200 })
  const candidates = (data?.donnees ?? []).filter((s) => filiereIdsActives.includes(s.filiereId))

  const actuelles = React.useMemo(
    () => seriesActivesDuNiveau.map((s) => s.serieId),
    [seriesActivesDuNiveau],
  )
  const [selection, setSelection] = React.useState<string[]>(actuelles)
  React.useEffect(() => setSelection(actuelles), [actuelles])

  const mutation = useMettreAJourSeriesActives()
  const modifie = !memeEnsemble(selection, actuelles)

  if (candidates.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-lg border border-border/60">
        {candidates.map((serie) => {
          const checked = selection.includes(serie.id)
          return (
            <label
              key={serie.id}
              className="flex items-center justify-between gap-3 bg-muted/10 px-3 py-2"
            >
              <span className="text-xs text-foreground">{serie.libelleCourt ?? serie.code}</span>
              <Switch
                checked={checked}
                disabled={disabled}
                onCheckedChange={(value) =>
                  setSelection((prev) =>
                    value ? [...prev, serie.id] : prev.filter((id) => id !== serie.id),
                  )
                }
              />
            </label>
          )
        })}
      </div>
      {mutation.error ? (
        <p className="text-xs text-destructive">{getErrorMessage(mutation.error)}</p>
      ) : null}
      {modifie && !disabled ? (
        <Button
          size="sm"
          className="w-fit"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate({ niveauActiveId, serieIds: selection })}
        >
          {mutation.isPending ? "Enregistrement…" : "Enregistrer les séries"}
        </Button>
      ) : null}
    </div>
  )
}
