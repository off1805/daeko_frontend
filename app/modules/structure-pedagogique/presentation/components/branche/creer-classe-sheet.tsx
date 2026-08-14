"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

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
import { getErrorMessage } from "~/shared/presentation/forms/form-field"
import { useCreerClasse } from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import { useReferentielLookup } from "~/modules/structure-pedagogique/presentation/hooks/use-referentiel-lookup"
import type {
  ConfigurationDetailDto,
} from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface CreerClasseSheetProps {
  configurationId: string
  detail: ConfigurationDetailDto
}

export function CreerClasseSheet({ configurationId, detail }: CreerClasseSheetProps) {
  const [open, setOpen] = React.useState(false)
  const [niveauActiveId, setNiveauActiveId] = React.useState<string>()
  const lookup = useReferentielLookup()
  const creer = useCreerClasse()

  const seriesDuNiveau = niveauActiveId
    ? detail.seriesActives.filter((s) => s.niveauActiveId === niveauActiveId)
    : []

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const serieActiveId = String(formData.get("serieActiveId") ?? "") || undefined
    const suffixesRaw = String(formData.get("suffixes") ?? "").trim()
    const suffixes = suffixesRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
    const effectifPrevuRaw = String(formData.get("effectifPrevu") ?? "").trim()
    const salle = String(formData.get("salle") ?? "").trim() || undefined

    if (!niveauActiveId || suffixes.length === 0) return

    creer.mutate(
      {
        configurationId,
        data: {
          niveauActiveId,
          serieActiveId,
          suffixes,
          effectifPrevu: effectifPrevuRaw ? Number(effectifPrevuRaw) : undefined,
          salle,
        },
      },
      {
        onSuccess: () => {
          setOpen(false)
          setNiveauActiveId(undefined)
        },
      },
    )
  }

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <PlusIcon />
        Nouvelle(s) classe(s)
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="overflow-y-auto sm:max-w-md">
          <form key={open ? "open" : "closed"} onSubmit={handleSubmit} className="flex h-full flex-col">
            <SheetHeader>
              <SheetTitle>Créer des classes</SheetTitle>
              <SheetDescription>
                Un suffixe (« A ») pour une classe, plusieurs séparés par une virgule (« A, B, C »)
                pour en créer plusieurs d'un coup.
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-1 flex-col gap-4 px-6">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="niveauActiveId">
                  Niveau<span className="text-destructive">*</span>
                </Label>
                <Select
                  value={niveauActiveId ?? null}
                  onValueChange={(value) => setNiveauActiveId((value as string) ?? undefined)}
                >
                  <SelectTrigger id="niveauActiveId" className="w-full">
                    <SelectValue placeholder="Choisir un niveau…">
                      {(current: string | null) => {
                        if (current == null) return "Choisir un niveau…"
                        const na = detail.niveauxActifs.find((n) => n.id === current)
                        const niveau = na ? lookup.niveauById.get(na.niveauId) : undefined
                        return niveau?.libelleCourt ?? niveau?.libelle ?? current
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {detail.niveauxActifs.map((na) => {
                      const niveau = lookup.niveauById.get(na.niveauId)
                      return (
                        <SelectItem key={na.id} value={na.id}>
                          {niveau?.libelleCourt ?? niveau?.libelle ?? na.niveauId}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <input type="hidden" name="niveauActiveId" value={niveauActiveId ?? ""} />
              </div>

              {seriesDuNiveau.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="serieActiveId">
                    Série<span className="text-destructive">*</span>
                  </Label>
                  <Select name="serieActiveId" defaultValue={null}>
                    <SelectTrigger id="serieActiveId" className="w-full">
                      <SelectValue placeholder="Choisir une série…">
                        {(current: string | null) => {
                          if (current == null) return "Choisir une série…"
                          const sa = seriesDuNiveau.find((s) => s.id === current)
                          const serie = sa ? lookup.serieById.get(sa.serieId) : undefined
                          return serie?.libelleCourt ?? serie?.code ?? current
                        }}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {seriesDuNiveau.map((sa) => {
                        const serie = lookup.serieById.get(sa.serieId)
                        return (
                          <SelectItem key={sa.id} value={sa.id}>
                            {serie?.libelleCourt ?? serie?.code ?? sa.serieId}
                          </SelectItem>
                        )
                      })}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="suffixes">
                  Suffixe(s)<span className="text-destructive">*</span>
                </Label>
                <Input id="suffixes" name="suffixes" required placeholder="A, B, C" />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="effectifPrevu">Effectif prévu</Label>
                <Input id="effectifPrevu" name="effectifPrevu" type="number" step={1} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="salle">Salle</Label>
                <Input id="salle" name="salle" />
              </div>

              {creer.error ? (
                <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                  {getErrorMessage(creer.error)}
                </div>
              ) : null}
            </div>

            <SheetFooter className="flex-row justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={creer.isPending}>
                Annuler
              </Button>
              <Button type="submit" disabled={creer.isPending || !niveauActiveId}>
                {creer.isPending ? "Création…" : "Créer"}
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
