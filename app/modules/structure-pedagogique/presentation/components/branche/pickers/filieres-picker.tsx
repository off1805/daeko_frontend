"use client"

import * as React from "react"

import { Button } from "~/components/ui/button"
import { Switch } from "~/components/ui/switch"
import { getErrorMessage } from "~/shared/presentation/forms/form-field"
import { filiereQueries } from "~/modules/referentiel/presentation"
import { useMettreAJourFilieresActives } from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import type { FiliereActiveDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface FilieresPickerProps {
  configurationId: string
  brancheOrdreEnseignementId: string
  brancheTypeEnseignementId: string
  filieresActives: FiliereActiveDto[]
  disabled?: boolean
}

function memeEnsemble(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false
  const setB = new Set(b)
  return a.every((v) => setB.has(v))
}

export function FilieresPicker({
  configurationId,
  brancheOrdreEnseignementId,
  brancheTypeEnseignementId,
  filieresActives,
  disabled,
}: FilieresPickerProps) {
  const { data } = filiereQueries.useList({ etat: "TOUS", taille: 200 })
  const candidates = (data?.donnees ?? []).filter(
    (f) => f.ordreEnseignementId === brancheOrdreEnseignementId && f.typeEnseignementId === brancheTypeEnseignementId,
  )
  const actuelles = React.useMemo(() => filieresActives.map((f) => f.filiereId), [filieresActives])
  const [selection, setSelection] = React.useState<string[]>(actuelles)
  React.useEffect(() => setSelection(actuelles), [actuelles])

  const mutation = useMettreAJourFilieresActives()
  const modifie = !memeEnsemble(selection, actuelles)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground">Filières</h3>
        <p className="text-xs text-muted-foreground">
          Active les filières proposées par cette branche — les séries qui en dépendent ne
          deviennent sélectionnables qu'une fois leur filière activée.
        </p>
      </div>

      {candidates.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-4 text-center text-xs text-muted-foreground">
          Aucune filière disponible pour cette branche dans le référentiel.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-lg border border-border/60">
          {candidates.map((filiere) => {
            const checked = selection.includes(filiere.id)
            return (
              <label
                key={filiere.id}
                className="flex items-center justify-between gap-3 bg-muted/10 px-3 py-2.5"
              >
                <span className="text-xs text-foreground">{filiere.libelle}</span>
                <Switch
                  checked={checked}
                  disabled={disabled}
                  onCheckedChange={(value) =>
                    setSelection((prev) =>
                      value ? [...prev, filiere.id] : prev.filter((id) => id !== filiere.id),
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
          onClick={() => mutation.mutate({ configurationId, filiereIds: selection })}
        >
          {mutation.isPending ? "Enregistrement…" : "Enregistrer les filières"}
        </Button>
      ) : null}
    </div>
  )
}
