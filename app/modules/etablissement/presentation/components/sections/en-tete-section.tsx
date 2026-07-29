"use client"

import * as React from "react"

import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import type { ModeEnTete } from "~/modules/etablissement/domain/value-objects/en-tete-ligne.vo"
import {
  useConfigureEnTete,
  useEtablissementDetails,
} from "~/modules/etablissement/infrastructure/queries/etablissement.queries"
import type { LigneEnTeteDto } from "~/modules/etablissement/application/dto/etablissement-read.dto"

interface EnTeteSectionProps {
  etablissementId: string | null
}

const lignesParDefaut = [
  { ordre: 1, texteFr: "REPUBLIQUE DU CAMEROUN", texteEn: "REPUBLIC OF CAMEROON" },
  { ordre: 2, texteFr: "Paix - Travail - Patrie", texteEn: "Peace - Work - Fatherland" },
  { ordre: 3, texteFr: "MINISTERE DES ENSEIGNEMENTS SECONDAIRES", texteEn: "MINISTRY OF SECONDARY EDUCATION" },
  { ordre: 4, texteFr: "", texteEn: "" },
  { ordre: 5, texteFr: "", texteEn: "" },
  { ordre: 6, texteFr: "", texteEn: "" },
]

export function EnTeteSection({ etablissementId }: EnTeteSectionProps) {
  const { data: etablissement, isLoading } = useEtablissementDetails(etablissementId ?? undefined)
  const configureEnTete = useConfigureEnTete()

  const [mode, setMode] = React.useState<ModeEnTete>("BILINGUE")


  // Synchronise l'état local dès que l'en-tête existant de l'établissement
  // sélectionné arrive (ou change) — sans ça, changer d'établissement
  // laisserait affichés les brouillons du précédent.

  const [lignes, setLignes] = React.useState<LigneEnTeteDto[]>(lignesParDefaut)
  React.useEffect(() => {
    if (etablissement?.enTete) {
      setMode(etablissement.enTete.mode)
      setLignes(etablissement.enTete.lignes)
    } else {
      setMode("BILINGUE")
      setLignes(lignesParDefaut)
    }
  }, [etablissement?.enTete])

  if (!etablissementId) {
    return (
      <div className="flex flex-col gap-1 rounded-xl border border-dashed p-8 text-center">
        <p className="text-sm font-medium text-foreground">Aucun établissement sélectionné</p>
        <p className="text-sm text-muted-foreground">
          Choisis un établissement depuis le Portefeuille pour configurer son en-tête.
        </p>
      </div>
    )
  }

  if (isLoading || !etablissement) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>
  }

  const handleLigneChange = (index: number, field: "texteFr" | "texteEn", value: string) => {
    const updated = [...lignes]
    updated[index] = { ...updated[index], [field]: value }
    setLignes(updated)
  }

  const handleSave = () => {
    configureEnTete.mutate({
      etablissementId,
      mode,
      lignes,
      auteurId: "superadmin",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">En-tête officiel</h1>
            <p className="text-sm text-muted-foreground">
              Structure hiérarchique réglementaire des documents scolaires
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Mode :</span>
            <select
              value={mode}
              onChange={(event) => setMode(event.target.value as ModeEnTete)}
              className="h-8 rounded-md border border-input bg-background px-2 text-xs font-medium text-foreground"
            >
              <option value="BILINGUE">Bilingue (FR / EN)</option>
              <option value="SIMPLE">Unilingue</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 pb-4">
          {lignes.map((ligne, idx) => (
            <div
              key={ligne.ordre}
              className="flex flex-col items-start gap-3 rounded-lg border bg-muted/40 p-3 md:flex-row md:items-center"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                {ligne.ordre}
              </span>
              <input
                type="text"
                placeholder="Texte en français"
                value={ligne.texteFr}
                onChange={(event) => handleLigneChange(idx, "texteFr", event.target.value)}
                className="h-9 w-full flex-1 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground"
              />
              {mode === "BILINGUE" && (
                <input
                  type="text"
                  placeholder="Texte en anglais"
                  value={ligne.texteEn || ""}
                  onChange={(event) => handleLigneChange(idx, "texteEn", event.target.value)}
                  className="h-9 w-full flex-1 rounded-md border border-input bg-background px-3 text-xs font-medium text-foreground"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={configureEnTete.isPending}>
            {configureEnTete.isPending ? "Enregistrement..." : "Enregistrer l'en-tête"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}