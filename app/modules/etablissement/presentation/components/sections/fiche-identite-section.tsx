"use client"

import * as React from "react"

import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import type { EtatCompte } from "~/modules/etablissement/domain/shared/etat-compte"
import { useEtablissementDetails } from "~/modules/etablissement/infrastructure/queries/etablissement.queries"


const etatBadgeVariant: Record<EtatCompte, "success" | "secondary" | "destructive"> = {
  EN_CREATION: "secondary",
  EN_ESSAI: "secondary",
  ACTIF: "success",
  SUSPENDU: "secondary",
  ARCHIVE: "destructive",
}
interface FicheIdentiteSectionProps {
  etablissementId: string | null
}

function ChampFiche({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

export function FicheIdentiteSection({ etablissementId }: FicheIdentiteSectionProps) {
  const { data: etablissement, isLoading } = useEtablissementDetails(etablissementId ?? undefined)

  if (!etablissementId) {
    return (
      <div className="flex flex-col gap-1 rounded-xl border border-dashed p-8 text-center">
        <p className="text-sm font-medium text-foreground">Aucun établissement sélectionné</p>
        <p className="text-sm text-muted-foreground">
          Choisis un établissement depuis le Portefeuille pour afficher sa fiche.
        </p>
      </div>
    )
  }

  if (isLoading || !etablissement) {
    return <p className="text-sm text-muted-foreground">Chargement de la fiche...</p>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-lg font-semibold text-foreground">{etablissement.nomOfficiel}</h1>
            <p className="text-sm text-muted-foreground">Fiche d'identité administrative</p>
          </div>
          <Badge variant={etatBadgeVariant[etablissement.etat]}>{etablissement.etat}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2">
          <ChampFiche label="Nom officiel" value={etablissement.nomOfficiel} />
          <ChampFiche label="Sigle" value={etablissement.sigle || "—"} />
          <ChampFiche label="Code officiel" value={etablissement.codeOfficiel || "—"} />
          <ChampFiche label="Arrêté d'agrément" value={etablissement.agrement || "—"} />
          <ChampFiche label="Statut juridique" value={etablissement.statutJuridiqueLibelle} />
          <ChampFiche
            label="Devise propre"
            value={etablissement.devisePropre ? `"${etablissement.devisePropre}"` : "—"}
          />
        </div>
      </CardContent>
    </Card>
  )
}