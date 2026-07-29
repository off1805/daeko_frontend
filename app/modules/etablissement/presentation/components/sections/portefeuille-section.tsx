"use client"

import * as React from "react"
import { BuildingIcon, PlusIcon, XIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet"
import type { Etablissement } from "~/modules/etablissement/domain/entities/etablissement.entity"
import type { EtatCompte } from "~/modules/etablissement/domain/shared/etat-compte"
import type { StatutJuridique } from "~/modules/etablissement/domain/shared/statut-juridique"
import { STATUT_JURIDIQUE_LABELS } from "~/modules/etablissement/domain/shared/statut-juridique"
import {
  useCreateEtablissement,
  usePortefeuilleEtablissements,
} from "~/modules/etablissement/infrastructure/queries/etablissement.queries"

const etatBadgeVariant: Record<EtatCompte, "success" | "secondary" | "destructive"> = {
  EN_CREATION: "secondary",
  EN_ESSAI: "secondary",
  ACTIF: "success",
  SUSPENDU: "secondary",
  ARCHIVE: "destructive",
}

const etatOptions: { value: EtatCompte | ""; label: string }[] = [
  { value: "", label: "Tous" },
  { value: "EN_CREATION", label: "En création" },
  { value: "ACTIF", label: "Actif" },
  { value: "SUSPENDU", label: "Suspendu" },
  { value: "ARCHIVE", label: "Archivé" },
]

const initialFormValues = {
  nomOfficiel: "",
  sigle: "",
  codeOfficiel: "",
  agrement: "",
  statutJuridique: "PUBLIC" as StatutJuridique,
  ville: "Yaoundé",
  departementCode: "MFOUNDI",
  arrondissementCode: "YAOUNDE 2",
  email: "",
  telephone: "",
  siteWeb: "",
}

interface PortefeuilleSectionProps {
  onSelectEtablissement: (id: string) => void
}

export function PortefeuilleSection({ onSelectEtablissement }: PortefeuilleSectionProps) {
  const [recherche, setRecherche] = React.useState("")
  const [etatFiltre, setEtatFiltre] = React.useState<EtatCompte | "">("")
  const [openSheet, setOpenSheet] = React.useState(false)
  const [formValues, setFormValues] = React.useState(initialFormValues)

  const { data, isLoading } = usePortefeuilleEtablissements(
    { recherche: recherche || undefined, etat: etatFiltre || undefined },
    { page: 1, limit: 50 },
  )
  const createEtablissement = useCreateEtablissement()

  const etablissements: Etablissement[] = data?.data ?? []

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formValues.nomOfficiel.trim()) return

    await createEtablissement.mutateAsync({
      tenantId: `tenant-${Date.now()}`,
      nomOfficiel: formValues.nomOfficiel,
      sigle: formValues.sigle || undefined,
      codeOfficiel: formValues.codeOfficiel || undefined,
      agrement: formValues.agrement || undefined,
      statutJuridique: formValues.statutJuridique,
      localisation: {
        regionCode: "CENTRE",
        departementCode: formValues.departementCode,
        arrondissementCode: formValues.arrondissementCode,
        ville: formValues.ville,
      },
      contacts: {
        email: formValues.email,
        telephone: formValues.telephone,
        adressePostale: `${formValues.ville}, ${formValues.arrondissementCode}`,
        siteWeb: formValues.siteWeb,
      },
      devisePropre: "",
      auteurId: "superadmin",
      auteurNom: "Super Admin",
    })

    setFormValues(initialFormValues)
    setOpenSheet(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-lg font-semibold text-foreground">Portefeuille Établissements</h1>
          <p className="text-sm text-muted-foreground">
            Liste, recherche et création des établissements du réseau.
          </p>
        </div>
        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
          <SheetTrigger>
            <Button size="sm" className="gap-2">
              <PlusIcon className="h-3.5 w-3.5" />
              Ajouter
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="max-w-md px-4 py-6">
            <SheetHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <SheetTitle>Nouvel établissement</SheetTitle>
                  <SheetDescription>Remplis les informations pour créer un établissement.</SheetDescription>
                </div>
                <SheetClose>
                  <Button variant="ghost" size="icon-sm">
                    <XIcon className="h-4 w-4" />
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>
            <form className="mt-5 space-y-4" onSubmit={handleCreate}>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Nom officiel</label>
                <Input
                  value={formValues.nomOfficiel}
                  onChange={(event) => setFormValues({ ...formValues, nomOfficiel: event.target.value })}
                  placeholder="Nom officiel"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Sigle</label>
                  <Input
                    value={formValues.sigle}
                    onChange={(event) => setFormValues({ ...formValues, sigle: event.target.value })}
                    placeholder="Sigle"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Code</label>
                  <Input
                    value={formValues.codeOfficiel}
                    onChange={(event) => setFormValues({ ...formValues, codeOfficiel: event.target.value })}
                    placeholder="Code officiel"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Statut</label>
                  <select
                    value={formValues.statutJuridique}
                    onChange={(event) =>
                      setFormValues({ ...formValues, statutJuridique: event.target.value as StatutJuridique })
                    }
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none"
                  >
                    {Object.entries(STATUT_JURIDIQUE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Ville</label>
                  <Input
                    value={formValues.ville}
                    onChange={(event) => setFormValues({ ...formValues, ville: event.target.value })}
                    placeholder="Ville"
                  />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Département</label>
                  <Input
                    value={formValues.departementCode}
                    onChange={(event) => setFormValues({ ...formValues, departementCode: event.target.value })}
                    placeholder="Département"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Arrondissement</label>
                  <Input
                    value={formValues.arrondissementCode}
                    onChange={(event) => setFormValues({ ...formValues, arrondissementCode: event.target.value })}
                    placeholder="Arrondissement"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Email</label>
                <Input
                  value={formValues.email}
                  onChange={(event) => setFormValues({ ...formValues, email: event.target.value })}
                  placeholder="Email"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Téléphone</label>
                  <Input
                    value={formValues.telephone}
                    onChange={(event) => setFormValues({ ...formValues, telephone: event.target.value })}
                    placeholder="Téléphone"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Site web</label>
                  <Input
                    value={formValues.siteWeb}
                    onChange={(event) => setFormValues({ ...formValues, siteWeb: event.target.value })}
                    placeholder="Site web"
                  />
                </div>
              </div>
              <SheetFooter>
                <Button type="submit" className="w-full">
                  Créer l'établissement
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={recherche}
          onChange={(event) => setRecherche(event.target.value)}
          placeholder="Recherche nom, code..."
          className="sm:max-w-xs"
        />
        <select
          value={etatFiltre}
          onChange={(event) => setEtatFiltre(event.target.value as EtatCompte | "")}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none"
        >
          {etatOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground sm:ml-auto">
          {etablissements.length} établissement{etablissements.length > 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Établissement</TableHead>
              <TableHead className="hidden sm:table-cell">Contact</TableHead>
              <TableHead className="hidden md:table-cell">Statut juridique</TableHead>
              <TableHead className="hidden lg:table-cell">Ville</TableHead>
              <TableHead>État</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : etablissements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                  Aucun établissement trouvé.
                </TableCell>
              </TableRow>
            ) : (
              etablissements.map((item) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer"
                  onClick={() => onSelectEtablissement(item.id)}
                >
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                        <BuildingIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        {item.nomOfficiel}
                      </div>
                      <span className="text-xs text-muted-foreground">{item.codeOfficiel ?? item.id}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">{item.contacts.email ?? "—"}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">{STATUT_JURIDIQUE_LABELS[item.statutJuridique]}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">{item.localisation.ville}</TableCell>
                  <TableCell>
                    <Badge variant={etatBadgeVariant[item.etat]}>{item.etat}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}