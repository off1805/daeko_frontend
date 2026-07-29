"use client"

import * as React from "react"

import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { useEtablissementDetails } from "~/modules/etablissement/infrastructure/queries/etablissement.queries"

interface LocalisationSectionProps {
  etablissementId: string | null
}

function LigneContact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b pb-2 last:border-none last:pb-0">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

export function LocalisationSection({ etablissementId }: LocalisationSectionProps) {
  const { data: etablissement, isLoading } = useEtablissementDetails(etablissementId ?? undefined)

  if (!etablissementId) {
    return (
      <div className="flex flex-col gap-1 rounded-xl border border-dashed p-8 text-center">
        <p className="text-sm font-medium text-foreground">Aucun établissement sélectionné</p>
        <p className="text-sm text-muted-foreground">
          Choisis un établissement depuis le Portefeuille pour afficher sa localisation.
        </p>
      </div>
    )
  }

  if (isLoading || !etablissement) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>
  }

  const { localisation, contacts } = etablissement

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <h3 className="text-base font-semibold text-foreground">Ancrage territorial</h3>
          <p className="text-xs text-muted-foreground">Hiérarchie administrative camerounaise</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Région</span>
              <p className="text-sm font-medium text-foreground">{localisation.regionCode}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Département</span>
              <p className="text-sm font-medium text-foreground">{localisation.departementCode}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Arrondissement</span>
              <p className="text-sm font-medium text-foreground">{localisation.arrondissementCode}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Ville / Localité</span>
              <p className="text-sm font-medium text-foreground">{localisation.ville}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-base font-semibold text-foreground">Contacts & canaux</h3>
          <p className="text-xs text-muted-foreground">Coordonnées institutionnelles</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 pb-4">
            <LigneContact label="Email officiel" value={contacts.email || "—"} />
            <LigneContact label="Téléphone" value={contacts.telephone || "—"} />
            <LigneContact label="Adresse postale" value={contacts.adressePostale || "—"} />
            <LigneContact label="Site web" value={contacts.siteWeb || "—"} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}