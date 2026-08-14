"use client"

import * as React from "react"

import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import { getErrorMessage } from "~/shared/presentation/forms/form-field"
import { cycleQueries, niveauQueries } from "~/modules/referentiel/presentation"
import { useMettreAJourNiveauxActifs } from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import type { NiveauActiveDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface NiveauxPickerProps {
  configurationId: string
  brancheSousSystemeId: string
  brancheOrdreEnseignementId: string
  niveauxActifs: NiveauActiveDto[]
  disabled?: boolean
}

function memeEnsemble(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  const setB = new Set(b)
  return a.every((v) => setB.has(v))
}

export function NiveauxPicker({
  configurationId,
  brancheSousSystemeId,
  brancheOrdreEnseignementId,
  niveauxActifs,
  disabled,
}: NiveauxPickerProps) {
  const { data: niveaux } = niveauQueries.useList({ etat: "TOUS", taille: 200 })
  const { data: cycles } = cycleQueries.useList({ etat: "TOUS", taille: 200 })
  const cycleById = new Map((cycles?.donnees ?? []).map((c) => [c.id, c]))

  const candidates = (niveaux?.donnees ?? []).filter((n) => {
    const cycle = cycleById.get(n.cycleId)
    return cycle?.sousSystemeId === brancheSousSystemeId && cycle?.ordreEnseignementId === brancheOrdreEnseignementId
  })

  const actuelles = React.useMemo(() => niveauxActifs.map((n) => n.niveauId), [niveauxActifs])
  const [selection, setSelection] = React.useState<string[]>(actuelles)
  React.useEffect(() => setSelection(actuelles), [actuelles])

  const mutation = useMettreAJourNiveauxActifs()
  const modifie = !memeEnsemble(selection, actuelles)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground">Niveaux</h3>
        <p className="text-xs text-muted-foreground">
          Active les niveaux enseignés dans cette branche — chaque niveau activé pourra ensuite
          recevoir ses propres séries, matières et classes.
        </p>
      </div>

      {candidates.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-4 text-center text-xs text-muted-foreground">
          Aucun niveau disponible pour cette branche dans le référentiel.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-lg border border-border/60">
          {candidates.map((niveau) => {
            const checked = selection.includes(niveau.id)
            return (
              <label
                key={niveau.id}
                className="flex items-center justify-between gap-3 bg-muted/10 px-3 py-2.5"
              >
                <span className="text-xs text-foreground">{niveau.libelleCourt ?? niveau.libelle}</span>
                <Switch
                  checked={checked}
                  disabled={disabled}
                  onCheckedChange={(value) =>
                    setSelection((prev) =>
                      value ? [...prev, niveau.id] : prev.filter((id) => id !== niveau.id),
                    )
                  }
                />
              </label>
            )
          })}
        </div>
      )}

      {mutation.error ? (
        <p className="text-xs text-destructive">{getErrorMessage(mutation.error)}</p>
      ) : null}
      {modifie && !disabled ? (
        <Button
          size="sm"
          className="w-fit"
          disabled={mutation.isPending}
          onClick={() => mutation.mutate({ configurationId, niveauIds: selection })}
        >
          {mutation.isPending ? "Enregistrement…" : "Enregistrer les niveaux"}
        </Button>
      ) : null}
    </div>
  )
}
