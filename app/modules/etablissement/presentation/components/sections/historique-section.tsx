"use client"

import * as React from "react"

import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { useAuditEntries } from "~/modules/etablissement/infrastructure/queries/etablissement.queries"

interface HistoriqueSectionProps {
  etablissementId: string | null
}

export function HistoriqueSection({ etablissementId }: HistoriqueSectionProps) {
  const { data: audits, isLoading } = useAuditEntries(etablissementId ?? undefined)

  if (!etablissementId) {
    return (
      <div className="flex flex-col gap-1 rounded-xl border border-dashed p-8 text-center">
        <p className="text-sm font-medium text-foreground">Aucun établissement sélectionné</p>
        <p className="text-sm text-muted-foreground">
          Choisis un établissement depuis le Portefeuille pour afficher son historique.
        </p>
      </div>
    )
  }

  if (isLoading || !audits) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="text-lg font-semibold text-foreground">Historique & traçabilité des actions</h1>
        <p className="text-sm text-muted-foreground">
          Journal d'audit technique et administratif conforme RM-12
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 pb-4">
          {audits.length === 0 ? (
            <p className="py-4 text-center text-sm italic text-muted-foreground">
              Aucune entrée d'audit enregistrée pour le moment.
            </p>
          ) : (
            audits.map((audit) => (
              <div
                key={audit.id}
                className="flex flex-col justify-between gap-2 border-b pb-4 last:border-none md:flex-row md:items-center"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{audit.action}</Badge>
                    <span className="text-xs text-muted-foreground">par {audit.auteurNom}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {audit.modifications.map((m, i) => (
                      <span key={i} className="rounded border bg-muted/40 px-2 py-1">
                        <b className="text-foreground">{m.champ}</b>
                        {" : "}
                        {m.valeurAncienne ? `${m.valeurAncienne} ➔ ` : ""}
                        {m.valeurNouvelle}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="shrink-0 text-xs font-medium text-muted-foreground">
                  {new Date(audit.date).toLocaleString("fr-FR")}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}