"use client"

import * as React from "react"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import {
  useAjouterSignataire,
  useEtablissementDetails,
} from "~/modules/etablissement/infrastructure/queries/etablissement.queries"

interface SignatairesSectionProps {
  etablissementId: string | null
}

export function SignatairesSection({ etablissementId }: SignatairesSectionProps) {
  const { data: etablissement, isLoading } = useEtablissementDetails(etablissementId ?? undefined)
  const ajouterSignataire = useAjouterSignataire()

  const [showForm, setShowForm] = React.useState(false)
  const [nom, setNom] = React.useState("")
  const [prenom, setPrenom] = React.useState("")
  const [fonction, setFonction] = React.useState("Proviseur")
  const [estPrincipal, setEstPrincipal] = React.useState(false)

  if (!etablissementId) {
    return (
      <div className="flex flex-col gap-1 rounded-xl border border-dashed p-8 text-center">
        <p className="text-sm font-medium text-foreground">Aucun établissement sélectionné</p>
        <p className="text-sm text-muted-foreground">
          Choisis un établissement depuis le Portefeuille pour gérer ses signataires.
        </p>
      </div>
    )
  }

  if (isLoading || !etablissement) {
    return <p className="text-sm text-muted-foreground">Chargement...</p>
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!nom || !fonction) return

    await ajouterSignataire.mutateAsync({
      etablissementId,
      nom,
      prenom: prenom || undefined,
      fonction,
      estPrincipal,
      auteurId: "superadmin",
    })

    setNom("")
    setPrenom("")
    setFonction("Proviseur")
    setEstPrincipal(false)
    setShowForm(false)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Signataires officiels & autorité</h1>
            <p className="text-sm text-muted-foreground">
              Gestion des autorités habilitées à signer les actes administratifs et bulletins
            </p>
          </div>
          <Button variant={showForm ? "outline" : "default"} size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Fermer" : "+ Ajouter un signataire"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 pb-4">
          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-muted/40 p-4">
              <h4 className="text-sm font-semibold text-foreground">Nouveau signataire</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input placeholder="Nom" value={nom} onChange={(event) => setNom(event.target.value)} required />
                <Input
                  placeholder="Prénom (optionnel)"
                  value={prenom}
                  onChange={(event) => setPrenom(event.target.value)}
                />
                <Input
                  placeholder="Fonction (ex : Proviseur, Directeur...)"
                  value={fonction}
                  onChange={(event) => setFonction(event.target.value)}
                  required
                />
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="estPrincipal"
                    checked={estPrincipal}
                    onChange={(event) => setEstPrincipal(event.target.checked)}
                    className="h-4 w-4 rounded border-input"
                  />
                  <label htmlFor="estPrincipal" className="text-sm font-medium text-foreground">
                    Définir comme signataire principal
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={ajouterSignataire.isPending}>
                  {ajouterSignataire.isPending ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {etablissement.signataires.length === 0 ? (
              <p className="col-span-full py-4 text-center text-sm italic text-muted-foreground">
                Aucun signataire enregistré pour le moment.
              </p>
            ) : (
              etablissement.signataires.map((sig) => (
                <div
                  key={sig.id}
                  className="flex items-center justify-between rounded-xl border bg-background p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{sig.nomComplet}</span>
                      {sig.estPrincipal && <Badge variant="secondary">Principal</Badge>}
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">{sig.fonction}</p>
                  </div>
                  <Badge variant={sig.estActif ? "success" : "secondary"}>
                    {sig.estActif ? "Actif" : "Inactif"}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}