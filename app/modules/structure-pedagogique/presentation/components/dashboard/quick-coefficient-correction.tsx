"use client"

import * as React from "react"
import { SlidersHorizontalIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { getErrorMessage } from "~/shared/presentation/forms/form-field"
import {
  useBranches,
  useConfigurationParBrancheEtAnnee,
  useCorrigerCoefficient,
} from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import { useReferentielLookup } from "~/modules/structure-pedagogique/presentation/hooks/use-referentiel-lookup"
import type { AnneeAcademiqueDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto"
import type { MatiereActiveDto } from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface QuickCoefficientCorrectionProps {
  anneeCourante: AnneeAcademiqueDto
}

/**
 * Vision UX : "le seul élément interactif visible en permanence" en état
 * stable — un accès discret à la correction ponctuelle de coefficient,
 * parce que c'est le seul geste imprévisible qui peut survenir n'importe
 * quand. Version v1 (voir le plan) : toujours autorisée, pas encore de
 * verrouillage réel selon l'état de l'année.
 */
export function QuickCoefficientCorrection({ anneeCourante }: QuickCoefficientCorrectionProps) {
  const [open, setOpen] = React.useState(false)
  const [brancheId, setBrancheId] = React.useState<string>()
  const [matiereActiveId, setMatiereActiveId] = React.useState<string>()
  const [recherche, setRecherche] = React.useState("")

  const { data: branches } = useBranches()
  const { data: detail } = useConfigurationParBrancheEtAnnee(brancheId, anneeCourante.id)
  const lookup = useReferentielLookup()
  const corriger = useCorrigerCoefficient()

  const branchesActives = (branches ?? []).filter((b) => b.etat === "ACTIVE")

  function libelleNiveauActive(niveauActiveId: string): string {
    const na = detail?.niveauxActifs.find((n) => n.id === niveauActiveId)
    if (!na) return "—"
    return lookup.niveauById.get(na.niveauId)?.libelle ?? na.niveauId
  }

  function libelleSerieActive(serieActiveId: string | undefined): string {
    if (!serieActiveId) return ""
    const sa = detail?.seriesActives.find((s) => s.id === serieActiveId)
    if (!sa) return ""
    const serie = lookup.serieById.get(sa.serieId)
    return serie ? ` · ${serie.libelleCourt ?? serie.code}` : ""
  }

  function libelleMatiere(ma: MatiereActiveDto): string {
    if (ma.matiereReferentielId) {
      const matiere = lookup.matiereById.get(ma.matiereReferentielId)
      return matiere?.libelle ?? "Matière"
    }
    return "Matière locale"
  }

  const matieres = (detail?.matieresActives ?? []).filter((ma) => {
    if (!recherche.trim()) return true
    const cible = recherche.trim().toLowerCase()
    return (
      libelleMatiere(ma).toLowerCase().includes(cible) ||
      libelleNiveauActive(ma.niveauActiveId).toLowerCase().includes(cible)
    )
  })

  const matiereSelectionnee = matieres.find((m) => m.id === matiereActiveId)

  // Champ contrôlé (pas defaultValue) : matiereSelectionnee est recalculée
  // à chaque rendu depuis les données serveur, un defaultValue changeant
  // après le montage n'est pas un pattern fiable ici.
  const [nouveauCoefficient, setNouveauCoefficient] = React.useState("")
  React.useEffect(() => {
    setNouveauCoefficient(matiereSelectionnee ? String(matiereSelectionnee.coefficient) : "")
  }, [matiereSelectionnee?.id])

  function reinitialiser() {
    setBrancheId(undefined)
    setMatiereActiveId(undefined)
    setRecherche("")
  }

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setOpen(true)}
              aria-label="Corriger un coefficient"
            >
              <SlidersHorizontalIcon />
            </Button>
          }
        />
        <TooltipContent>Correction ponctuelle de coefficient</TooltipContent>
      </Tooltip>

      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) reinitialiser()
        }}
      >
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Correction ponctuelle de coefficient</SheetTitle>
            <SheetDescription>
              Pour l'anomalie qui se révèle en cours d'année — retrouvez la matière concernée
              et corrigez son coefficient avec un motif.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-4 px-6">
            {matiereSelectionnee ? (
              <form
                key={matiereSelectionnee.id}
                className="flex flex-col gap-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  const formData = new FormData(event.currentTarget)
                  const motif = String(formData.get("motif") ?? "").trim()
                  corriger.mutate(
                    {
                      matiereActiveId: matiereSelectionnee.id,
                      nouveauCoefficient: Number(nouveauCoefficient),
                      motif,
                    },
                    { onSuccess: () => setOpen(false) },
                  )
                }}
              >
                <div className="rounded-lg border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground">
                  {libelleMatiere(matiereSelectionnee)} — {libelleNiveauActive(matiereSelectionnee.niveauActiveId)}
                  {libelleSerieActive(matiereSelectionnee.serieActiveId)}
                  <br />
                  Coefficient actuel : <span className="font-medium text-foreground">{matiereSelectionnee.coefficient}</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="coefficient">Nouveau coefficient</Label>
                  <Input
                    id="coefficient"
                    name="coefficient"
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={nouveauCoefficient}
                    onChange={(event) => setNouveauCoefficient(event.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="motif">
                    Motif<span className="text-destructive">*</span>
                  </Label>
                  <textarea
                    id="motif"
                    name="motif"
                    required
                    rows={3}
                    placeholder="Ex : coefficient mal saisi à la configuration, corrigé sur signalement du surveillant général."
                    className="w-full rounded-md border border-input bg-input/20 px-2 py-1.5 text-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 dark:bg-input/30"
                  />
                </div>

                {corriger.error ? (
                  <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                    {getErrorMessage(corriger.error)}
                  </div>
                ) : null}

                <SheetFooter className="flex-row justify-end gap-2 px-0">
                  <Button type="button" variant="outline" onClick={() => setMatiereActiveId(undefined)}>
                    Retour
                  </Button>
                  <Button type="submit" disabled={corriger.isPending}>
                    {corriger.isPending ? "Enregistrement…" : "Corriger"}
                  </Button>
                </SheetFooter>
              </form>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="branche-correction">Branche</Label>
                  <Select
                    value={brancheId ?? null}
                    onValueChange={(value) => {
                      setBrancheId(value ?? undefined)
                      setMatiereActiveId(undefined)
                    }}
                  >
                    <SelectTrigger id="branche-correction" className="w-full">
                      <SelectValue placeholder="Choisir une branche…">
                        {(current: string | null) =>
                          current == null
                            ? "Choisir une branche…"
                            : (branchesActives.find((b) => b.id === current)?.libelle ?? current)
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {branchesActives.map((b) => (
                        <SelectItem key={b.id} value={b.id}>
                          {b.libelle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {brancheId ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      placeholder="Rechercher une matière ou un niveau…"
                      value={recherche}
                      onChange={(event) => setRecherche(event.target.value)}
                    />
                    <div className="flex max-h-80 flex-col gap-1 overflow-y-auto">
                      {matieres.length === 0 ? (
                        <p className="rounded-lg border border-dashed border-border/60 p-3 text-center text-xs text-muted-foreground">
                          Aucune matière ne correspond.
                        </p>
                      ) : (
                        matieres.map((ma) => (
                          <button
                            key={ma.id}
                            type="button"
                            onClick={() => setMatiereActiveId(ma.id)}
                            className="flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-muted/20 px-3 py-2 text-left text-xs transition-colors hover:border-border hover:bg-muted/50"
                          >
                            <span>
                              {libelleMatiere(ma)} — {libelleNiveauActive(ma.niveauActiveId)}
                              {libelleSerieActive(ma.serieActiveId)}
                            </span>
                            <span className="font-medium tabular-nums">{ma.coefficient}</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
