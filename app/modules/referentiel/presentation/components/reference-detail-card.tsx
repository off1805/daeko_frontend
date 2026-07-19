"use client"

import { ArrowLeftIcon } from "lucide-react"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import type { ReferentielLifecycleDto } from "~/modules/referentiel/application/dto/referentiel-read.dto"

export interface ReferenceCardField {
  label: string
  value: React.ReactNode
}

export interface ReferenceCardItem {
  id: string
  code: string
  titre: string
  sousTitre?: string
  description?: string
  champs: ReferenceCardField[]
  lifecycle: ReferentielLifecycleDto
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" })

export function formatReferentielDate(value: string | null | undefined): string {
  if (!value) return "—"
  return dateFormatter.format(new Date(value))
}

/**
 * Vue détail d'une entrée du référentiel : réutilisée par la grille de
 * cards (Système d'enseignement) et par les tableaux TanStack (clic sur
 * une ligne) — un seul rendu de détail pour toutes les ressources.
 */
export function ReferenceDetailCard({
  item,
  onBack,
  backLabel = "Retour à la liste",
  actions,
}: {
  item: ReferenceCardItem
  onBack: () => void
  backLabel?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Button variant="ghost" size="sm" className="w-fit" onClick={onBack}>
          <ArrowLeftIcon />
          {backLabel}
        </Button>
        {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
      </div>

      <Card className="border-border/60 bg-muted/20 shadow-none">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle className="text-base">{item.titre}</CardTitle>
            <Badge variant="outline">{item.code}</Badge>
            <Badge
              variant={item.lifecycle.etat === "ACTIVE" ? "success" : "secondary"}
            >
              {item.lifecycle.etat === "ACTIVE" ? "Actif" : "Déprécié"}
            </Badge>
          </div>
          {item.sousTitre ? (
            <CardDescription>{item.sousTitre}</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {item.description ? (
            <p className="text-sm text-muted-foreground">{item.description}</p>
          ) : null}

          <div className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-lg bg-background/60 p-4 sm:grid-cols-2">
            {item.champs.map((champ) => (
              <div key={champ.label} className="flex flex-col gap-0.5">
                <span className="text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
                  {champ.label}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {champ.value ?? "—"}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            <span>
              Entrée en vigueur : {formatReferentielDate(item.lifecycle.dateEntreeVigueur)}
            </span>
            <span>Créée le : {formatReferentielDate(item.lifecycle.dateCreation)}</span>
            <span>
              Modifiée le : {formatReferentielDate(item.lifecycle.dateModification)}
            </span>
          </div>

          {item.lifecycle.etat === "DEPRECATED" ? (
            <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
              Dépréciée le {formatReferentielDate(item.lifecycle.dateDepreciation)}
              {item.lifecycle.motifDepreciation
                ? ` — ${item.lifecycle.motifDepreciation}`
                : ""}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
