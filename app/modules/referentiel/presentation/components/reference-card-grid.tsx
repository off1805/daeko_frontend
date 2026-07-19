"use client"

import * as React from "react"

import { cn } from "~/lib/utils"
import { Badge } from "~/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  ReferenceDetailCard,
  type ReferenceCardItem,
} from "~/modules/referentiel/presentation/components/reference-detail-card"

export type { ReferenceCardField, ReferenceCardItem } from "~/modules/referentiel/presentation/components/reference-detail-card"

interface ReferenceCardGridProps {
  items: ReferenceCardItem[]
  isLoading?: boolean
  emptyMessage?: string
  renderActions?: (item: ReferenceCardItem) => React.ReactNode
}

/**
 * Grille de cards "soft" pour parcourir une ressource du référentiel ;
 * cliquer une card bascule la même zone vers une vue détail (pas de
 * navigation, pas de modale). Réservée aux tables racines (Système
 * d'enseignement) — les ressources à fort volume utilisent
 * ReferenceDataTable (doc sections 3.4 à 3.6) à la place.
 */
export function ReferenceCardGrid({
  items,
  isLoading,
  emptyMessage = "Aucune entrée à afficher.",
  renderActions,
}: ReferenceCardGridProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const selected = selectedId
    ? items.find((item) => item.id === selectedId)
    : undefined

  React.useEffect(() => {
    if (selectedId && !items.some((item) => item.id === selectedId)) {
      setSelectedId(null)
    }
  }, [items, selectedId])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl bg-muted/40"
          />
        ))}
      </div>
    )
  }

  if (selected) {
    return (
      <ReferenceDetailCard
        item={selected}
        onBack={() => setSelectedId(null)}
        actions={renderActions?.(selected)}
      />
    )
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.id}
          role="button"
          tabIndex={0}
          onClick={() => setSelectedId(item.id)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              setSelectedId(item.id)
            }
          }}
          className={cn(
            "cursor-pointer border-border/50 bg-muted/25 shadow-none outline-none transition-colors hover:border-border hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
          )}
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-1">{item.titre}</CardTitle>
              <Badge variant="outline" className="shrink-0">
                {item.code}
              </Badge>
            </div>
            {item.sousTitre ? (
              <CardDescription className="line-clamp-1">
                {item.sousTitre}
              </CardDescription>
            ) : null}
          </CardHeader>
          {item.description || item.lifecycle.etat === "DEPRECATED" ? (
            <CardContent className="flex flex-col gap-2">
              {item.description ? (
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
              {item.lifecycle.etat === "DEPRECATED" ? (
                <Badge variant="secondary" className="w-fit">
                  Déprécié
                </Badge>
              ) : null}
            </CardContent>
          ) : null}
        </Card>
      ))}
    </div>
  )
}
