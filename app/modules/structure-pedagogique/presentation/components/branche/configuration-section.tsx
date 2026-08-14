"use client"

import * as React from "react"
import { LockIcon, TriangleAlertIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import { ConfigurationAssistant } from "~/modules/structure-pedagogique/presentation/components/branche/configuration-assistant"
import { ConfigurationModeLibre } from "~/modules/structure-pedagogique/presentation/components/branche/configuration-mode-libre"
import { CreerMatiereLocaleSheet } from "~/modules/structure-pedagogique/presentation/components/branche/creer-matiere-locale-sheet"
import { useReferentielLookup } from "~/modules/structure-pedagogique/presentation/hooks/use-referentiel-lookup"
import type {
  AnneeAcademiqueDto,
  BrancheDto,
  ConfigurationDetailDto,
} from "~/modules/structure-pedagogique/application/dto/structure-read.dto"

interface ConfigurationSectionProps {
  branche: BrancheDto
  detail: ConfigurationDetailDto
  anneeCourante: AnneeAcademiqueDto | null
}

type Mode = "assistant" | "libre"

/**
 * Doc 6.1 (referentiel.entree_depreciee) : sans bus d'événements côté mock,
 * le signalement se recalcule à la lecture plutôt qu'à la réception d'un
 * événement — même résultat pour l'administrateur, "aucune donnée n'est
 * modifiée", juste un bandeau tant que la configuration reste OUVERTE.
 */
function useElementsDepreciesSignales(detail: ConfigurationDetailDto) {
  const lookup = useReferentielLookup()
  if (detail.configuration.etat !== "OUVERTE") return []

  const signalements: string[] = []
  for (const fa of detail.filieresActives) {
    const filiere = lookup.filiereById.get(fa.filiereId)
    if (filiere?.etat === "DEPRECATED") signalements.push(`Filière ${filiere.libelle}`)
  }
  for (const na of detail.niveauxActifs) {
    const niveau = lookup.niveauById.get(na.niveauId)
    if (niveau?.etat === "DEPRECATED") signalements.push(`Niveau ${niveau.libelleCourt ?? niveau.libelle}`)
  }
  for (const sa of detail.seriesActives) {
    const serie = lookup.serieById.get(sa.serieId)
    if (serie?.etat === "DEPRECATED") signalements.push(`Série ${serie.libelleCourt ?? serie.code}`)
  }
  for (const ma of detail.matieresActives) {
    if (!ma.matiereReferentielId) continue
    const matiere = lookup.matiereById.get(ma.matiereReferentielId)
    if (matiere?.etat === "DEPRECATED") signalements.push(`Matière ${matiere.libelle}`)
  }
  return Array.from(new Set(signalements))
}

/**
 * Doc vision UX : "l'assistant en escalier, ou le mode libre pour
 * ajustements ponctuels" — un même contenu, deux façons de le parcourir.
 * Défaut : assistant tant que rien n'est configuré, mode libre ensuite.
 */
export function ConfigurationSection({ branche, detail, anneeCourante }: ConfigurationSectionProps) {
  const configurationVide = detail.niveauxActifs.length === 0 && detail.filieresActives.length === 0
  const [mode, setMode] = React.useState<Mode>(configurationVide ? "assistant" : "libre")
  const elementsDepreciesSignales = useElementsDepreciesSignales(detail)
  const anneeEnCours = anneeCourante?.etat === "EN_COURS"

  return (
    <div className="flex flex-col gap-4">
      {detail.configuration.etat === "SCELLEE" ? (
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
          <LockIcon className="size-4 shrink-0" />
          Configuration scellée — l'année est clôturée, lecture seule.
        </div>
      ) : anneeEnCours ? (
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
          <LockIcon className="size-4 shrink-0" />
          L'année {anneeCourante?.libelle} est en cours — la structure (filières, niveaux, séries,
          matières) ne peut pas être modifiée avant sa clôture.
        </div>
      ) : null}

      {elementsDepreciesSignales.length > 0 ? (
        <div className="flex items-start gap-2 rounded-lg border border-warning-solid/30 bg-warning-bg p-3 text-xs text-warning-text">
          <TriangleAlertIcon className="size-4 shrink-0" />
          <div className="flex flex-col gap-1">
            <p className="font-medium">
              Élément obsolète, utilisable jusqu'à la clôture de l'année en cours
            </p>
            <p>{elementsDepreciesSignales.join(" · ")}</p>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-foreground">Configuration</h2>
        <div className="flex items-center gap-2">
          <CreerMatiereLocaleSheet brancheId={branche.id} />
          <div className="flex items-center gap-1 rounded-lg border border-border/60 p-0.5">
            <Button
              variant={mode === "assistant" ? "secondary" : "ghost"}
              size="xs"
              className={cn(mode === "assistant" && "shadow-sm")}
              onClick={() => setMode("assistant")}
            >
              Assistant
            </Button>
            <Button
              variant={mode === "libre" ? "secondary" : "ghost"}
              size="xs"
              className={cn(mode === "libre" && "shadow-sm")}
              onClick={() => setMode("libre")}
            >
              Mode libre
            </Button>
          </div>
        </div>
      </div>

      {mode === "assistant" ? (
        <ConfigurationAssistant branche={branche} detail={detail} disabled={anneeEnCours} />
      ) : (
        <ConfigurationModeLibre branche={branche} detail={detail} disabled={anneeEnCours} />
      )}
    </div>
  )
}
