"use client"

import * as React from "react"
import { BuildingIcon, ChevronRightIcon, PlusIcon, XIcon } from "lucide-react"

import { SiteNavbar } from "~/components/site-navbar"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose, SheetFooter } from "~/components/ui/sheet"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "~/components/ui/table"
import { etablissementContainer } from "~/modules/etablissement/infrastructure/etablissement.container"
import type { Etablissement } from "~/modules/etablissement/domain/entities/etablissement.entity"
import type { EtatCompte } from "~/modules/etablissement/domain/shared/etat-compte"
import type { StatutJuridique } from "~/modules/etablissement/domain/shared/statut-juridique"
import { STATUT_JURIDIQUE_LABELS } from "~/modules/etablissement/domain/shared/statut-juridique"

const statutColors: Record<string, string> = {
  EN_CREATION: "bg-slate-100 text-slate-700",
  ACTIF: "bg-emerald-100 text-emerald-800",
  SUSPENDU: "bg-amber-100 text-amber-800",
  ARCHIVE: "bg-rose-100 text-rose-800",
}

const etatOptions = [
  { value: "", label: "Tous" },
  { value: "EN_CREATION", label: "En création" },
  { value: "ACTIF", label: "Actif" },
  { value: "SUSPENDU", label: "Suspendu" },
  { value: "ARCHIVE", label: "Archivé" },
]

export default function DashboardsudoPage() {
  const [etablissements, setEtablissements] = React.useState<Etablissement[]>([])
  const [recherche, setRecherche] = React.useState("")
  const [etatFiltre, setEtatFiltre] = React.useState<EtatCompte | "">("")
  const [openSheet, setOpenSheet] = React.useState(false)
  const [formValues, setFormValues] = React.useState<{
    nomOfficiel: string
    sigle: string
    codeOfficiel: string
    agrement: string
    statutJuridique: StatutJuridique
    ville: string
    departementCode: string
    arrondissementCode: string
    email: string
    telephone: string
    siteWeb: string
  }>({
    nomOfficiel: "",
    sigle: "",
    codeOfficiel: "",
    agrement: "",
    statutJuridique: "PUBLIC",
    ville: "Yaoundé",
    departementCode: "MFOUNDI",
    arrondissementCode: "YAOUNDE 2",
    email: "",
    telephone: "",
    siteWeb: "",
  })
  const [loading, setLoading] = React.useState(true)

  const loadEtablissements = React.useCallback(async () => {
    setLoading(true)
    const result = await etablissementContainer.repository.findAll(
      {
        recherche: recherche || undefined,
        etat: etatFiltre || undefined,
      },
      { page: 1, limit: 50 }
    )
    setEtablissements(result.data)
    setLoading(false)
  }, [recherche, etatFiltre])

  React.useEffect(() => {
    void loadEtablissements()
  }, [loadEtablissements])

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formValues.nomOfficiel.trim()) return

    await etablissementContainer.createEtablissement.execute({
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

    setFormValues({
      nomOfficiel: "",
      sigle: "",
      codeOfficiel: "",
      agrement: "",
      statutJuridique: "PUBLIC",
      ville: "Yaoundé",
      departementCode: "MFOUNDI",
      arrondissementCode: "YAOUNDE 2",
      email: "",
      telephone: "",
      siteWeb: "",
    })
    setOpenSheet(false)
    void loadEtablissements()
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "14rem",
          "--topbar-height": "3rem",
        } as React.CSSProperties
      }
    >
      <SiteNavbar breadcrumb="Dashboard Sudo" />
      <div className="flex min-h-0 flex-1">
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-slate-50 p-4 md:p-6">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-900">
                    <BuildingIcon className="h-6 w-6" />
                    <h1 className="text-xl font-black">Daeko Superadmin</h1>
                  </div>
                  <p className="mt-2 max-w-2xl text-[0.75rem] leading-5 text-slate-500">
                    Gestion professionnelle des établissements avec une vue compacte et des actions rapides.
                  </p>
                </div>
                <div className="flex items-center">
                  <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                    <SheetTrigger>
                      <Button size="sm" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-white">
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
                          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Nom officiel</label>
                          <Input
                            value={formValues.nomOfficiel}
                            onChange={(event) => setFormValues({ ...formValues, nomOfficiel: event.target.value })}
                            placeholder="Nom officiel"
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Sigle</label>
                            <Input
                              value={formValues.sigle}
                              onChange={(event) => setFormValues({ ...formValues, sigle: event.target.value })}
                              placeholder="Sigle"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Code</label>
                            <Input
                              value={formValues.codeOfficiel}
                              onChange={(event) => setFormValues({ ...formValues, codeOfficiel: event.target.value })}
                              placeholder="Code officiel"
                            />
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Statut</label>
                            <select
                              value={formValues.statutJuridique}
                              onChange={(event) =>
                                setFormValues({
                                  ...formValues,
                                  statutJuridique: event.target.value as StatutJuridique,
                                })
                              }
                              className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none"
                            >
                              {Object.entries(STATUT_JURIDIQUE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Ville</label>
                            <Input
                              value={formValues.ville}
                              onChange={(event) => setFormValues({ ...formValues, ville: event.target.value })}
                              placeholder="Ville"
                            />
                          </div>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Département</label>
                            <Input
                              value={formValues.departementCode}
                              onChange={(event) => setFormValues({ ...formValues, departementCode: event.target.value })}
                              placeholder="Département"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Arrondissement</label>
                            <Input
                              value={formValues.arrondissementCode}
                              onChange={(event) => setFormValues({ ...formValues, arrondissementCode: event.target.value })}
                              placeholder="Arrondissement"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Email</label>
                          <Input
                            value={formValues.email}
                            onChange={(event) => setFormValues({ ...formValues, email: event.target.value })}
                            placeholder="Email"
                          />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Téléphone</label>
                            <Input
                              value={formValues.telephone}
                              onChange={(event) => setFormValues({ ...formValues, telephone: event.target.value })}
                              placeholder="Téléphone"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Site web</label>
                            <Input
                              value={formValues.siteWeb}
                              onChange={(event) => setFormValues({ ...formValues, siteWeb: event.target.value })}
                              placeholder="Site web"
                            />
                          </div>
                        </div>
                        <SheetFooter>
                          <Button type="submit" className="w-full rounded-full bg-slate-900 text-white">
                            Créer l’établissement
                          </Button>
                        </SheetFooter>
                      </form>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>

            <div className="grid xl:grid-cols-[280px_1fr] xl:divide-x xl:divide-slate-200 rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-5 text-[0.75rem]">
                <div className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Filtres
                </div>
                <div className="mt-4 divide-y divide-slate-200">
                  <div className="space-y-2 py-4">
                    <label className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-600">Rechercher</label>
                    <Input
                      value={recherche}
                      onChange={(event) => setRecherche(event.target.value)}
                      placeholder="Recherche nom, code..."
                    />
                  </div>
                  <div className="space-y-2 py-4">
                    <label className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-600">État</label>
                    <select
                      value={etatFiltre}
                      onChange={(event) => setEtatFiltre(event.target.value as EtatCompte | "")}
                      className="h-9 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none"
                    >
                      {etatOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 text-[0.75rem]">
                <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Portefeuille établissements
                    </div>
                    <div className="mt-1 text-[0.72rem] text-slate-500">
                      Vue synthétique des établissements disponibles.
                    </div>
                  </div>
                  <div className="text-[0.75rem] text-slate-500">
                    {etablissements.length} éléments
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200">
                  <Table className="text-[0.75rem]">
                    <TableHeader>
                      <TableRow className="bg-slate-100">
                        <TableHead>Établissement</TableHead>
                        <TableHead className="hidden sm:table-cell">Administrateur</TableHead>
                        <TableHead className="hidden md:table-cell">Offre / Type</TableHead>
                        <TableHead className="hidden lg:table-cell">Quartier</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-6 text-center text-slate-500">
                            Chargement...
                          </TableCell>
                        </TableRow>
                      ) : etablissements.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-6 text-center text-slate-500">
                            Aucun établissement trouvé.
                          </TableCell>
                        </TableRow>
                      ) : (
                        etablissements.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                  <BuildingIcon className="h-3.5 w-3.5 text-slate-500" />
                                  {item.nomOfficiel}
                                </div>
                                <span className="text-[0.65rem] text-slate-500">{item.codeOfficiel ?? item.id}</span>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-slate-700">{item.contacts.email ?? "-"}</TableCell>
                            <TableCell className="hidden md:table-cell text-slate-700">{STATUT_JURIDIQUE_LABELS[item.statutJuridique]}</TableCell>
                            <TableCell className="hidden lg:table-cell text-slate-700">{item.localisation.ville}</TableCell>
                            <TableCell>
                              <span className={`inline-flex rounded-full px-2 py-1 text-[0.65rem] font-semibold ${statutColors[item.etat] ?? statutColors.EN_CREATION}`}>
                                {item.etat}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-[0.7rem] text-slate-500">
                  <span>{etablissements.length} établissements</span>
                  <ChevronRightIcon className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
