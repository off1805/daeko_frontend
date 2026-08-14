"use client"

import * as React from "react"
import { PlusIcon, XIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Switch } from "~/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { getErrorMessage } from "~/shared/presentation/forms/form-field"
import { matiereReferentielNiveauQueries } from "~/modules/referentiel/presentation"
import {
  useMatieresLocales,
  useMettreAJourMatieresActives,
} from "~/modules/structure-pedagogique/infrastructure/queries/structure.queries"
import { useReferentielLookup } from "~/modules/structure-pedagogique/presentation/hooks/use-referentiel-lookup"
import type {
  MatiereActiveDto,
  SerieActiveDto,
} from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface Ligne {
  clef: string
  id?: string
  matiereReferentielId?: string
  matiereLocaleId?: string
  serieActiveId?: string
  coefficient: number
  bareme?: number
  estObligatoire: boolean
  libelle: string
  scopeLibelle: string
}

interface MatiereActiveEditorProps {
  niveauActiveId: string
  niveauId: string
  brancheId: string
  seriesActives: SerieActiveDto[]
  matieresActives: MatiereActiveDto[]
  disabled?: boolean
}

function ligneDepuisMatiereActive(
  ma: MatiereActiveDto,
  lookup: ReturnType<typeof useReferentielLookup>,
  matieresLocalesById: Map<string, { libelle: string }>,
  seriesActives: SerieActiveDto[],
): Ligne {
  const serie = ma.serieActiveId ? seriesActives.find((s) => s.id === ma.serieActiveId) : undefined
  const serieRef = serie ? lookup.serieById.get(serie.serieId) : undefined
  const libelle = ma.matiereReferentielId
    ? (lookup.matiereById.get(ma.matiereReferentielId)?.libelle ?? "Matière")
    : (matieresLocalesById.get(ma.matiereLocaleId ?? "")?.libelle ?? "Matière locale")
  return {
    clef: ma.id,
    id: ma.id,
    matiereReferentielId: ma.matiereReferentielId,
    matiereLocaleId: ma.matiereLocaleId,
    serieActiveId: ma.serieActiveId,
    coefficient: ma.coefficient,
    bareme: ma.bareme,
    estObligatoire: ma.estObligatoire,
    libelle,
    scopeLibelle: serieRef ? `Série ${serieRef.libelleCourt ?? serieRef.code}` : "Tronc commun",
  }
}

/**
 * Éditeur partagé par l'assistant (dernière étape) et le mode libre (doc
 * vision UX) : une ligne par matière active, quelle que soit sa portée
 * (tronc commun ou une série précise). La soumission envoie l'état cible
 * complet pour CE niveau (toutes portées confondues) — c'est le périmètre
 * réel de PUT /niveaux-actifs/{id}/matieres (doc 5.3).
 */
export function MatiereActiveEditor({
  niveauActiveId,
  niveauId,
  brancheId,
  seriesActives,
  matieresActives,
  disabled,
}: MatiereActiveEditorProps) {
  const lookup = useReferentielLookup()
  const { data: matieresLocales } = useMatieresLocales(brancheId)
  const matieresLocalesById = new Map((matieresLocales ?? []).map((m) => [m.id, m]))
  const { data: suggestions } = matiereReferentielNiveauQueries.useList({
    niveauId,
    etat: "TOUS",
    taille: 200,
  })

  const lignesInitiales = React.useMemo(
    () => matieresActives.map((ma) => ligneDepuisMatiereActive(ma, lookup, matieresLocalesById, seriesActives)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matieresActives],
  )
  const [lignes, setLignes] = React.useState<Ligne[]>(lignesInitiales)
  React.useEffect(() => setLignes(lignesInitiales), [lignesInitiales])

  const mutation = useMettreAJourMatieresActives()

  const optionsAjout = [
    { valeur: "", libelle: "Ajouter une matière…" },
    ...(suggestions?.donnees ?? [])
      .filter(
        (s) =>
          !lignes.some(
            (l) => l.matiereReferentielId === s.matiereReferentielId && l.serieActiveId === s.serieId,
          ),
      )
      .map((s) => {
        const serieActive = s.serieId ? seriesActives.find((sa) => sa.serieId === s.serieId) : undefined
        const matiere = lookup.matiereById.get(s.matiereReferentielId)
        const serieRef = s.serieId ? lookup.serieById.get(s.serieId) : undefined
        return {
          valeur: `ref:${s.matiereReferentielId}:${s.serieId ?? ""}`,
          libelle: `${matiere?.libelle ?? "Matière"}${serieRef ? ` (série ${serieRef.libelleCourt ?? serieRef.code})` : ""} — coef. suggéré ${s.coefficientSuggere ?? "—"}`,
          matiereReferentielId: s.matiereReferentielId,
          serieActiveId: serieActive?.id,
          coefficientSuggere: s.coefficientSuggere,
          estObligatoire: s.estObligatoire,
        }
      }),
    ...(matieresLocales ?? [])
      .filter((m) => m.etat === "ACTIVE" && !lignes.some((l) => l.matiereLocaleId === m.id && !l.serieActiveId))
      .map((m) => ({
        valeur: `loc:${m.id}:`,
        libelle: `${m.libelle} (locale)`,
        matiereLocaleId: m.id,
        serieActiveId: undefined as string | undefined,
        coefficientSuggere: undefined as number | undefined,
        estObligatoire: true,
      })),
  ]

  function ajouterLigne(valeur: string) {
    const option = optionsAjout.find((o) => o.valeur === valeur) as
      | (typeof optionsAjout)[number] & {
          matiereReferentielId?: string
          matiereLocaleId?: string
          serieActiveId?: string
          coefficientSuggere?: number
          estObligatoire?: boolean
        }
      | undefined
    if (!option || !valeur) return
    setLignes((prev) => [
      ...prev,
      {
        clef: valeur + prev.length,
        matiereReferentielId: option.matiereReferentielId,
        matiereLocaleId: option.matiereLocaleId,
        serieActiveId: option.serieActiveId,
        coefficient: option.coefficientSuggere ?? 1,
        estObligatoire: option.estObligatoire ?? true,
        libelle: option.libelle.split(" — ")[0].split(" (")[0],
        scopeLibelle: option.serieActiveId ? "Série" : "Tronc commun",
      },
    ])
  }

  return (
    <div className="flex flex-col gap-3">
      {lignes.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-4 text-center text-xs text-muted-foreground">
          Aucune matière activée pour ce niveau.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border/60 overflow-hidden rounded-lg border border-border/60">
          {lignes.map((ligne) => (
            <div
              key={ligne.clef}
              className="flex flex-wrap items-center gap-3 bg-muted/10 px-3 py-2 text-xs"
            >
              <span className="min-w-0 flex-1 truncate text-foreground">{ligne.libelle}</span>
              <span className="shrink-0 text-[0.65rem] text-muted-foreground">{ligne.scopeLibelle}</span>
              <div className="flex items-center gap-1">
                <span className="text-[0.65rem] text-muted-foreground">Coef.</span>
                <Input
                  type="number"
                  step="0.5"
                  min="0.5"
                  className="h-6 w-16"
                  disabled={disabled}
                  value={ligne.coefficient}
                  onChange={(event) =>
                    setLignes((prev) =>
                      prev.map((l) =>
                        l.clef === ligne.clef ? { ...l, coefficient: Number(event.target.value) } : l,
                      ),
                    )
                  }
                />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[0.65rem] text-muted-foreground">Obligatoire</span>
                <Switch
                  checked={ligne.estObligatoire}
                  disabled={disabled}
                  onCheckedChange={(value) =>
                    setLignes((prev) =>
                      prev.map((l) => (l.clef === ligne.clef ? { ...l, estObligatoire: value } : l)),
                    )
                  }
                />
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                disabled={disabled}
                onClick={() => setLignes((prev) => prev.filter((l) => l.clef !== ligne.clef))}
              >
                <XIcon />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <PlusIcon className="size-3.5 text-muted-foreground" />
        <Select value="" onValueChange={(value) => value && ajouterLigne(value as string)} disabled={disabled}>
          <SelectTrigger className="w-full max-w-sm">
            <SelectValue placeholder="Ajouter une matière…">
              {() => "Ajouter une matière…"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {optionsAjout
              .filter((o) => o.valeur)
              .map((o) => (
                <SelectItem key={o.valeur} value={o.valeur}>
                  {o.libelle}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {mutation.error ? <p className="text-xs text-destructive">{getErrorMessage(mutation.error)}</p> : null}

      {disabled ? null : (
        <Button
          size="sm"
          className="w-fit"
          disabled={mutation.isPending}
          onClick={() =>
            mutation.mutate({
              niveauActiveId,
              matieres: lignes.map((l) => ({
                id: l.id,
                matiereReferentielId: l.matiereReferentielId,
                matiereLocaleId: l.matiereLocaleId,
                serieActiveId: l.serieActiveId,
                coefficient: l.coefficient,
                bareme: l.bareme,
                estObligatoire: l.estObligatoire,
              })),
            })
          }
        >
          {mutation.isPending ? "Enregistrement…" : "Enregistrer les matières"}
        </Button>
      )}
    </div>
  )
}
